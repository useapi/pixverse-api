/*

Script version 1.0, November 23, 2026

Generate looping animated GIFs with GPT Image 2.6 (Flare and Sunburst) through the PixVerse API by useapi.net.
Submits each prompt with POST /images/create (output_format "gif"), polls GET /images/{image_id}
every 5 seconds until image_status_final is true and downloads the GIF to output/<name>.gif.
For more details visit https://useapi.net/docs/api-pixverse-v2/post-pixverse-images-create

Installation Instructions:
==========================

You need Node.js v21 or newer installed to run this script. Download and install Node.js from:

- Windows, macOS, Linux: https://nodejs.org/

After installation, verify by running the following command in a terminal:

   node -v

Running the Script:
===================

Usage: node gif.mjs [JOBS_FILE]

Set USEAPI_TOKEN to your actual useapi.net API token, see https://useapi.net/docs/start-here/setup-useapi
Optionally set PIXVERSE_EMAIL to a configured PixVerse email account, see https://useapi.net/docs/start-here/setup-pixverse
Without PIXVERSE_EMAIL the API picks one of your accounts for every GIF.
If optional JOBS_FILE not provided prompts.json will be used.

Example:
--------

USEAPI_TOKEN=user:1234-abcdefhijklmnopqrstuv PIXVERSE_EMAIL=my@email.com node gif.mjs

Changelog:
==========

- November 23, 2026: Initial release.

*/

import fs from 'node:fs/promises';
import path from 'node:path';

const DEFAULT_JOBS_FILE = 'prompts.json';
const RESULTS_FILE = 'gif_results.txt';
const OUTPUT_DIR = 'output';
const SLEEP_POLL = 5 * 1000; // a GIF takes about 20 to 50 seconds
const SLEEP_429 = 30 * 1000;
const TIMEOUT = 10 * 60 * 1000;

const api = 'https://api.useapi.net/v2/pixverse';
// PixVerse's media server refuses downloads without a browser-like User-Agent
const DOWNLOAD_HEADERS = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36' };

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const log = async (line) => {
    console.log(line);
    await fs.appendFile(RESULTS_FILE, `${new Date().toISOString()} ${line}\n`);
};

// 429: every account is busy (or the PixVerse account is at its maxJobs limit), wait and send the same request again
async function createImage(token, body) {
    for (;;) {
        const response = await fetch(`${api}/images/create`, {
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
    const token = process.env.USEAPI_TOKEN;
    const email = process.env.PIXVERSE_EMAIL;
    const jobsFile = process.argv[2] ?? DEFAULT_JOBS_FILE;
    if (!token) {
        console.log('Usage: USEAPI_TOKEN=<API_TOKEN> [PIXVERSE_EMAIL=<EMAIL>] node gif.mjs [JOBS_FILE]');
        process.exit(1);
    }

    const jobs = JSON.parse(await fs.readFile(jobsFile, 'utf8'));
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    for (const [index, job] of jobs.entries()) {
        const name = path.basename(job.name ?? `gif-${index + 1}`);
        try {
            // name stays local, everything else (prompt, model, gif_frame_size, frame_count, frame_duration_ms, detail_level) goes to the API
            const { name: _name, ...settings } = job;
            const body = { ...(email && { email }), output_format: 'gif', ...settings };

            const created = await createImage(token, body);
            if (created.status !== 200) {
                await log(`${name}: create failed ${created.status} ${JSON.stringify(created.result)}`);
                continue;
            }
            const { image_id, cost_credits } = created.result;
            await log(`${name}: started ${image_id}, ${cost_credits} credits`);

            const started = Date.now();
            let image;
            for (;;) {
                await sleep(SLEEP_POLL);
                const response = await fetch(`${api}/images/${encodeURIComponent(image_id)}`, { headers: { 'Authorization': `Bearer ${token}` } });
                image = await response.json();
                console.log(`${name}: ${Math.round((Date.now() - started) / 1000)} s ${response.status} ${image.image_status_name ?? image.error}`);
                if (!response.ok || image.image_status_final) break;
                if (Date.now() - started > TIMEOUT) break;
            }

            if (image.image_status_name !== 'COMPLETED') {
                await log(`${name}: ${image.image_status_name ?? 'error'} ${image.error ?? ''}`);
                continue;
            }

            const file = path.join(OUTPUT_DIR, `${name}.gif`);
            await download(image.image_url, file);
            await log(`${name}: done in ${Math.round((Date.now() - started) / 1000)} s, ${image.output_width}x${image.output_height}, ${image.frame_count} frames at ${image.frame_duration_ms} ms, saved to ${file}`);
        } catch (error) {
            await log(`${name}: ${error.message}`);
        }
    }
}

main();
