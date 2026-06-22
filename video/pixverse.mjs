/*

Script version 1.0, June 15, 2026

Script to batch-generate videos using prompts with the PixVerse API v2 by useapi.net 🚀
Uses the POST /videos/create endpoint (default model: v6) and polls GET /videos/{video_id}.
For more details visit https://useapi.net/docs/api-pixverse-v2/post-pixverse-videos-create-v4

Installation Instructions:
==========================

You need Node.js v21 or newer installed to run this script. Download and install Node.js from:

- Windows, macOS, Linux: https://nodejs.org/

After installation, verify by running the following command in a terminal:

   node -v

Running the Script:
===================

Usage: node pixverse.mjs <API_TOKEN> <EMAIL> [PROMPTS_FILE]

Replace API_TOKEN with your actual useapi.net API token, see https://useapi.net/docs/start-here/setup-useapi
Replace EMAIL with configured PixVerse email account, see https://useapi.net/docs/start-here/setup-pixverse
If optional PROMPTS_FILE not provided prompts.json will be used.

Example:
--------

node pixverse.mjs user:1234-abcdefhijklmnopqrstuv my@email.com

This command executes the script using API token user:1234-abcdefhijklmnopqrstuv with my@email.com PixVerse account email.

Changelog:
==========

- June 15, 2026: Initial release.

*/

import readline from 'node:readline';
import fs from 'fs/promises';
import { writeFile } from 'node:fs/promises';
import { Readable } from 'node:stream';


// Constants
const RESULTS_FILE = 'pixverse_results.txt';
const ERRORS_FILE = 'pixverse_errors.txt';
const DEFAULT_PROMPTS_FILE = 'prompts.json';
const DEFAULT_MODEL = 'v6';
const SLEEP_429 = 30 * 1000; // in milliseconds
const SLEEP_POLL = 15 * 1000; // in milliseconds

const urlAccounts = 'https://api.useapi.net/v2/pixverse/accounts';
const urlCreate = 'https://api.useapi.net/v2/pixverse/videos/create';
const urlVideo = 'https://api.useapi.net/v2/pixverse/videos/'; // + video_id (poll)
const urlFiles = 'https://api.useapi.net/v2/pixverse/files/'; // + ?email= (upload)

// PixVerse accepts these image extensions for uploaded frames.
const supportedFileExtensions = ['png', 'jpeg', 'jpg', 'gif', 'webp'];

// { filename: path }
const uploadedFiles = {};

// Utility to sleep for given milliseconds
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Function to fetch configured PixVerse API accounts
async function fetchAccounts(apiToken) {
    const response = await fetch(urlAccounts, {
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${apiToken}`
        }
    });

    if (!response.ok) {
        console.error(`⛔ Error fetching accounts (HTTP ${response.status}): ${response.statusText}`);
        process.exit(1);
    }

    return response.json();
}

const elapsedTimeSec = (start) => (Date.now() - start) / 1000;

// Map a file extension to the Content-Type required by POST /files
const contentTypeForExt = (ext) =>
    ext === 'png' ? 'image/png' :
    ext === 'gif' ? 'image/gif' :
    ext === 'webp' ? 'image/webp' : 'image/jpeg';

// Upload a local image and return its PixVerse `path` (used as first_frame_path etc.)
async function uploadFile(apiToken, email, filename) {

    // Check if already uploaded
    if (uploadedFiles.hasOwnProperty(filename))
        return uploadedFiles[filename];

    const startTime = Date.now();

    console.log(`⬆️  Account ${email} uploading file…`, filename);

    const body = new Blob([await fs.readFile(filename)]);

    const fileExt = filename.split('.').pop().toLowerCase();

    const response = await fetch(`${urlFiles}?email=${encodeURIComponent(email)}`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${apiToken}`,
            'Content-Type': contentTypeForExt(fileExt)
        },
        body
    });

    if (response.ok) {
        const json = await response.json();
        // Image uploads return result[0].path; use that as the frame path.
        const path = json?.result?.[0]?.path ?? json?.path;
        console.log(`🆗 path (${elapsedTimeSec(startTime)} sec)`, path);
        uploadedFiles[filename] = path;
    }
    else {
        console.error(`❗ Unable to upload file HTTP ${response.status} (${elapsedTimeSec(startTime)} sec)`, await response.text());
        // Do not attempt to upload failed file again
        uploadedFiles[filename] = undefined;
    }

    return uploadedFiles[filename];
}

async function submit(apiToken, url, body, index, prompt) {
    const createResponse = await fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiToken}`
        },
        body
    });

    const createBody = await createResponse.text();

    // POST /videos/create returns 200 with a video_id to poll.
    if (createResponse.status == 200) {
        const json = JSON.parse(createBody);
        const videoId = json.video_id ?? json.image_id;
        if (videoId) {
            await fs.appendFile(RESULTS_FILE, `${videoId},#${index}:${prompt}\n`);
            console.log(`✅ video_id`, videoId);
            return 200;
        } else {
            const error = `No video_id found in HTTP 200 response`;
            console.log(`❓ ${error}`, createBody);
            await fs.appendFile(ERRORS_FILE, `${error},#${index}:${prompt}\n`);
            return 500;
        }
    } else {
        switch (createResponse.status) {
            case 429:
                console.log(`🔄️ Account busy / concurrent limit, retry on HTTP ${createResponse.status}`, createBody);
                break;
            case 400:
                console.log(`🛑 Rejected request (validation)`, createBody);
                await fs.appendFile(ERRORS_FILE, `${createResponse.status},#${index}:${prompt}\n`);
                break;
            case 412:
                console.log(`🛑 Insufficient credits`, createBody);
                break;
            case 422:
                console.log(`🛑 Moderated prompt`, createBody);
                await fs.appendFile(ERRORS_FILE, `${createResponse.status},#${index}:${prompt}\n`);
                break;
            default:
                console.log(`❗ FAILED with HTTP ${createResponse.status}`, createBody);
                await fs.appendFile(ERRORS_FILE, `${createResponse.status},#${index}:${prompt}\n`);
        }
        return createResponse.status;
    }
}

// Submit a single prompt to POST /videos/create.
// first_frame_path (uploaded image) switches to image-to-video; aspect_ratio is then derived from the image.
async function submitVideo(apiToken, email, prompt, index) {
    const {
        model, prompt: text, first_frame_path, duration, quality, aspect_ratio,
        audio, multi_shot, preview_mode, off_peak_mode, seed, template_id
    } = prompt;

    const useModel = model ?? DEFAULT_MODEL;

    console.log(`🚀 ${useModel} » Prompt #${index} • account ${email} …`);

    const framePath = first_frame_path ? await uploadFile(apiToken, email, first_frame_path) : undefined;

    const body = JSON.stringify({
        model: useModel,
        email,
        prompt: text,
        first_frame_path: framePath,
        duration,
        quality,
        // aspect_ratio is required for text-to-video, not accepted for image-to-video
        aspect_ratio: framePath ? undefined : aspect_ratio,
        audio,
        multi_shot,
        preview_mode,
        off_peak_mode,
        seed,
        template_id
    });

    return await submit(apiToken, urlCreate, body, index, text);
}

// Function to poll and download videos
async function download(apiToken) {
    if (! await fileExists(RESULTS_FILE)) return;

    try {
        const resultsContent = await fs.readFile(RESULTS_FILE, 'utf8');
        const lines = resultsContent.trim().split('\n');

        for (const line of lines) {
            const [videoId, prompt] = line.split(',');

            console.log(`👉 ${videoId}`);

            while (true) {
                const response = await fetch(`${urlVideo}${videoId}`, {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${apiToken}`
                    }
                });

                // 404 means the video is still processing — keep waiting.
                if (response.status == 404) {
                    console.log(`⌛ ${videoId} still processing, waiting…`);
                    await sleep(SLEEP_POLL);
                    continue;
                }

                if (!response.ok) {
                    console.log(`🛑 Poll failed ${videoId} (HTTP ${response.status}):\n${prompt}\n`, await response.text());
                    break;
                }

                const job = await response.json();
                const { url, video_status_name, video_status_final, error } = job;

                if (error) {
                    console.error(`🛑 FAILED ${videoId} (${error}):\n${prompt}\n`);
                    break;
                }

                // Poll until the status is final (COMPLETED, MODERATED, etc.).
                if (!video_status_final) {
                    console.log(`⌛ ${videoId} status (${video_status_name}) and is still in progress, waiting…`);
                    await sleep(SLEEP_POLL);
                    continue;
                }

                if (video_status_name !== 'COMPLETED' || !url) {
                    console.error(`🛑 ${videoId} finished as ${video_status_name} with no url:\n${prompt}\n`);
                    break;
                }

                const videoFilename = `${videoId.replace(/[:*]/g, '_')}.mp4`;

                try {
                    await fs.access(videoFilename);
                    console.log(`⚠️ ${videoFilename} already exists. Skipping download.`);
                    break;
                } catch {
                    // File does not exist, proceed with downloading
                }

                console.log(`✅ Downloading ${url} to ${videoFilename}`);
                try {
                    const videoResponse = await fetch(url);
                    if (!videoResponse.ok) {
                        console.error(`⛔ Unable to download ${videoId} (HTTP ${videoResponse.status}):\n${prompt}\n`, url);
                        break;
                    }
                    const stream = Readable.fromWeb(videoResponse.body);
                    await writeFile(videoFilename, stream);
                } catch (err) {
                    console.error(`⛔ Error during download: ${err}`);
                }

                break;
            }
        }
    } catch (error) {
        console.log(`⛔ Error during download:`, error.stack || error);
    }
}

// Main function
async function main() {
    const apiToken = process.argv[2];
    const email = process.argv[3];
    const promptFile = process.argv[4] || DEFAULT_PROMPTS_FILE;

    if (!apiToken || !email) {
        console.error('Usage: node pixverse.mjs <API_TOKEN> <EMAIL> [PROMPTS_FILE]');
        process.exit(1);
    }

    console.info('Script v1.0');

    console.info('Node version is: ' + process.version);

    try {
        if (await fileExists(RESULTS_FILE)) {
            let user_input;
            while (!['y', 'n'].includes(user_input)) {
                user_input = (await promptUser(`❔ ${RESULTS_FILE} file detected. Do you want to download the results now? (y/n): `))?.toLowerCase();
                if (user_input == 'y') {
                    await download(apiToken);
                    await fs.unlink(RESULTS_FILE);
                }
            }
        }

        const start = new Date();
        try {
            console.info('START EXECUTION', start);
            await execute(apiToken, email, promptFile); // Pass the promptFile to execute function
        }
        finally {
            console.info('COMPLETED', new Date());
            console.info('EXECUTION ELAPSED', diffInMinutesAndSeconds(start, new Date()));
        }

        try {
            console.info('START DOWNLOAD', start);
            await download(apiToken);
        }
        finally {
            console.info('TOTAL ELAPSED', diffInMinutesAndSeconds(start, new Date()));
        }
    } catch (error) {
        console.error('⛔ Error during execution:', error.stack || error);
    }
}

// Modify the execute function to accept promptFile as a parameter
async function execute(apiToken, email, promptFile) {
    const accounts = await fetchAccounts(apiToken);

    console.info(`Configured PixVerse API accounts (${Object.keys(accounts).length}):`, Object.keys(accounts).join(', '));

    if (Object.keys(accounts).length <= 0) {
        console.error(`⛔ No configured PixVerse accounts found. Please refer to https://useapi.net/docs/start-here/setup-pixverse`);
        process.exit(1);
    }

    if (!accounts[email]) {
        console.error(`⛔ Account ${email} not found. Please refer to https://useapi.net/docs/start-here/setup-pixverse`);
        process.exit(1);
    }

    const promptData = await fs.readFile(promptFile, 'utf8');
    const prompts = JSON.parse(promptData);
    console.log(`Total number of prompts to process`, prompts.length);

    let warnings = [];

    // Parameters accepted by this script for the POST /videos/create endpoint.
    // See https://useapi.net/docs/api-pixverse-v2/post-pixverse-videos-create-v4 for the full parameter set.
    const supportedParams = ['model', 'prompt', 'first_frame_path', 'duration', 'quality', 'aspect_ratio',
        'audio', 'multi_shot', 'preview_mode', 'off_peak_mode', 'seed', 'template_id'];

    const invalidKeys = (prompt) => Object.keys(prompt).filter(key => !key.startsWith('__') && !supportedParams.includes(key))

    for (let i = 1; i <= prompts.length; i++) {
        const prompt = prompts[i - 1];
        const { prompt: text, first_frame_path, aspect_ratio, template_id } = prompt;

        if (first_frame_path) {
            try {
                await fs.access(first_frame_path);
            } catch {
                warnings.push(`⚠️  Image '${first_frame_path}' does not exist. Prompt ${i}`);
            }

            const ext = first_frame_path.split('.').pop().toLowerCase();

            if (!supportedFileExtensions.includes(ext))
                warnings.push(`⚠️  Image ${first_frame_path} extension ${ext} not supported. Prompt ${i}`);
        }

        const notSupported = invalidKeys(prompt);
        if (notSupported.length)
            warnings.push(`⚠️  Following params not supported: ${notSupported.join(',')}. Prompt ${i}`);

        // prompt is optional only when a template_id supplies the generation.
        if (!text && !template_id)
            warnings.push(`⚠️  prompt is required (unless template_id is set). Prompt ${i}`);

        // aspect_ratio is required for text-to-video, not accepted for image-to-video.
        if (!first_frame_path && !template_id && !aspect_ratio)
            warnings.push(`⚠️  aspect_ratio is required for text-to-video. Prompt ${i}`);
    }

    if (warnings.length > 0) {
        warnings.forEach(warning => console.warn(warning));
        console.error(`⛔ Execution stopped due to warnings.`);
        process.exit(1);
    }

    for (let i = 0; i < prompts.length; i++) {
        const prompt = prompts[i];
        while (true) {
            const responseCode = await submitVideo(apiToken, email, prompt, i + 1);
            if (responseCode == 429)
                await sleep(SLEEP_429);
            else
                if (responseCode == 412) {
                    process.exit(1);
                } else
                    break;
        }
    }
}

// Utility function to check if a file exists
async function fileExists(path) {
    try {
        await fs.access(path);
        return true;
    } catch {
        return false;
    }
}

// Function to prompt user input
async function promptUser(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => rl.question(query, answer => {
        rl.close();
        resolve(answer);
    }));
}

function diffInMinutesAndSeconds(date1, date2) {
    const diffInSeconds = Math.floor((date2 - date1) / 1000);
    return `${Math.floor(diffInSeconds / 60)} minutes ${diffInSeconds % 60} seconds`;
};

main();
