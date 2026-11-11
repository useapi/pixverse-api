/*

Script version 1.0, November 11, 2026

Turn songs into AI music videos with the PixVerse API by useapi.net (PixVerse's One-Click MV).
Uploads each song and character photo via POST /files, quotes the price for free, creates the
music video with POST /music-video/create, polls GET /music-video/{video_id} and downloads the
video plus its extra files (a copy without captions, the subtitle file, key images and clips).
For more details visit https://useapi.net/docs/api-pixverse-v2/post-pixverse-music-video-create

Installation Instructions:
==========================

You need Node.js v21 or newer installed to run this script. Download and install Node.js from:

- Windows, macOS, Linux: https://nodejs.org/

After installation, verify by running the following command in a terminal:

   node -v

Running the Script:
===================

Usage: node music-video.mjs <API_TOKEN> <EMAIL> [JOBS_FILE] [--quote]

Replace API_TOKEN with your actual useapi.net API token, see https://useapi.net/docs/start-here/setup-useapi
Replace EMAIL with configured PixVerse email account, see https://useapi.net/docs/start-here/setup-pixverse
If optional JOBS_FILE not provided music-videos.json will be used.
With --quote the script only prints the price of every job and creates nothing (quotes are free).

Example:
--------

node music-video.mjs user:1234-abcdefhijklmnopqrstuv my@email.com --quote
node music-video.mjs user:1234-abcdefhijklmnopqrstuv my@email.com

Changelog:
==========

- November 11, 2026: Initial release.

*/

import fs from 'node:fs/promises';
import path from 'node:path';

const DEFAULT_JOBS_FILE = 'music-videos.json';
const RESULTS_FILE = 'music_video_results.txt';
const OUTPUT_DIR = 'output';
const SLEEP_POLL = 20 * 1000; // a 30-second song renders in about 5 minutes, a 2.5-minute song in about 16
const SLEEP_429 = 30 * 1000;

const api = 'https://api.useapi.net/v2/pixverse';
const audioTypes = { '.mp3': 'audio/mpeg', '.wav': 'audio/wav' };
const imageTypes = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp' };
// PixVerse's media server refuses downloads without a browser-like User-Agent
const DOWNLOAD_HEADERS = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36' };

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const log = async (line) => {
    console.log(line);
    await fs.appendFile(RESULTS_FILE, `${new Date().toISOString()} ${line}\n`);
};

// Upload a local song or image; library paths (asset/...) and already uploaded paths (upload/...) pass through
async function upload(token, email, file, types) {
    if (/^(asset|upload)\//.test(file)) return file;
    const type = types[path.extname(file).toLowerCase()];
    if (!type) throw new Error(`Unsupported file type: ${file} (use ${Object.keys(types).join(', ')})`);
    const response = await fetch(`${api}/files/?email=${encodeURIComponent(email)}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': type },
        body: await fs.readFile(file)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(`Upload of ${file} failed: ${response.status} ${JSON.stringify(result)}`);
    // an audio upload answers { path }, an image upload answers { result: [{ path }] }
    return result.path ?? result.result?.[0]?.path;
}

async function createMusicVideo(token, body) {
    for (;;) {
        const response = await fetch(`${api}/music-video/create`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const result = await response.json();
        if (response.status === 429) {
            console.log(`429 all accounts busy, retrying in ${SLEEP_429 / 1000} s`);
            await sleep(SLEEP_429);
            continue;
        }
        return { status: response.status, result };
    }
}

async function download(url, file) {
    const response = await fetch(url, { headers: DOWNLOAD_HEADERS });
    if (!response.ok) throw new Error(`Download of ${url} failed: ${response.status}`);
    await fs.writeFile(file, Buffer.from(await response.arrayBuffer()));
}

async function main() {
    const args = process.argv.slice(2);
    const quoteOnly = args.includes('--quote');
    const [token, email, jobsFile = DEFAULT_JOBS_FILE] = args.filter(a => a !== '--quote');
    if (!token || !email) {
        console.log('Usage: node music-video.mjs <API_TOKEN> <EMAIL> [JOBS_FILE] [--quote]');
        process.exit(1);
    }

    const jobs = JSON.parse(await fs.readFile(jobsFile, 'utf8'));
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    for (const [index, job] of jobs.entries()) {
        const name = job.name ?? `music-video-${index + 1}`;
        try {
            const { song, character, character_2, style_image, name: _name, ...settings } = job;
            const body = { email, ...settings, audio_path: await upload(token, email, song, audioTypes) };
            if (character) body.image_path = await upload(token, email, character, imageTypes);
            if (character_2) body.image_path_2 = await upload(token, email, character_2, imageTypes);
            if (style_image) body.style_image_path = await upload(token, email, style_image, imageTypes);

            // The quote is free and exact: cost_credits is 0 while the account's free music video is unused
            const quote = await createMusicVideo(token, { ...body, quote: true });
            if (quote.status !== 200) {
                await log(`${name}: quote failed ${quote.status} ${JSON.stringify(quote.result)}`);
                continue;
            }
            const q = quote.result;
            await log(`${name}: ${q.mode} ${q.quality}, ${q.bill_seconds} s of song x ${q.credits_per_second} credits/s = ${q.cost_credits} credits${q.free ? ' (free music video)' : ''}`);
            if (quoteOnly) continue;
            if (!q.has_enough_credits) {
                await log(`${name}: skipped, the account needs ${q.cost_credits} credits`);
                continue;
            }

            const created = await createMusicVideo(token, body);
            if (created.status !== 200) {
                await log(`${name}: create failed ${created.status} ${JSON.stringify(created.result)}`);
                continue;
            }
            const { video_id } = created.result;
            await log(`${name}: started ${video_id}`);

            const started = Date.now();
            let mv;
            for (;;) {
                await sleep(SLEEP_POLL);
                const response = await fetch(`${api}/music-video/${video_id}`, { headers: { 'Authorization': `Bearer ${token}` } });
                mv = await response.json();
                console.log(`${name}: ${Math.round((Date.now() - started) / 1000)} s ${response.status} ${mv.status ?? mv.error}`);
                if (!response.ok || mv.status === 'succeeded' || mv.status === 'failed') break;
            }

            if (mv.status !== 'succeeded') {
                await log(`${name}: ${mv.status ?? 'error'} ${mv.error ?? ''} (a failed music video is refunded)`);
                continue;
            }

            const dir = path.join(OUTPUT_DIR, name);
            await fs.mkdir(dir, { recursive: true });
            await download(mv.video.url, path.join(dir, `${name}.mp4`));
            for (const f of mv.files ?? [])
                if (f.url) await download(f.url, path.join(dir, f.file_name));
            await log(`${name}: done in ${Math.round((Date.now() - started) / 1000)} s, ${mv.video.width}x${mv.video.height}, ${mv.video.duration} s, saved to ${dir} with ${mv.files?.length ?? 0} extra files`);
        } catch (error) {
            await log(`${name}: ${error.message}`);
        }
    }
}

main();
