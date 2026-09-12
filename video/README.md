# PixVerse V6 video — PixVerse API batch generation (Node.js)

Batch-generate [PixVerse](https://pixverse.ai) **V6** (and `v5.6`, `v5.5`, `v5`, `v5-fast`, `pixverse-c1`, plus the third-party models PixVerse hosts — Seedance 2.0, Kling V3 / O3, Veo 3.1, Sora 2, Grok Imagine, HappyHorse) video through the [PixVerse API](https://useapi.net/docs/api-pixverse-v2) by [useapi.net](https://useapi.net/?utm_source=github&utm_medium=readme&utm_campaign=pixverse-api).

📖 Full walkthrough: **[How to Generate AI Video with PixVerse V6 via the PixVerse API](https://useapi.net/docs/articles/pixverse-demo)**

`pixverse.mjs` reads prompts from `prompts.json`, uploads any input frame image via [`POST /files`](https://useapi.net/docs/api-pixverse-v2/post-pixverse-files), submits each job to [`POST /videos/create`](https://useapi.net/docs/api-pixverse-v2/post-pixverse-videos-create-v4) (default model `v6`), polls [`GET /videos/{video_id}`](https://useapi.net/docs/api-pixverse-v2/get-pixverse-videos-video_id) until each task is final, and downloads every finished MP4. All requests are served under the `/v2/pixverse/...` base path (for example `https://api.useapi.net/v2/pixverse/videos/create`).

## Prerequisites

- [Node.js](https://nodejs.org) v21 or newer (no dependencies to install — uses built-in `fetch`)
- A useapi.net [API token](https://useapi.net/docs/start-here/setup-useapi?utm_source=github&utm_medium=readme&utm_campaign=pixverse-api)
- A connected [PixVerse account](https://useapi.net/docs/start-here/setup-pixverse) email

## Usage

```bash
node ./pixverse.mjs <API_TOKEN> <EMAIL> [PROMPTS_FILE]
```

`PROMPTS_FILE` defaults to `prompts.json`. The script looks the account up by email before submitting. While a video is still processing the poll endpoint returns `404`; the script keeps waiting until the task is final, then downloads the MP4.

## Prompts

`prompts.json` is an array of prompt objects. `prompt` is required (unless a `template_id` supplies the generation); for text-to-video `aspect_ratio` is optional (the server defaults to `16:9` when omitted). The default model is `v6` — pick another with the `model` field (`v6`, `v5.6`, `v5.5`, `v5`, `v5-fast`, `pixverse-c1`, or a third-party id such as `seedance-2.0` / `seedance-2.0-fast`, `kling-o3` / `kling-v3`, `veo-3.1-lite` / `veo-3.1-standard` / `veo-3.1-fast`, `sora-2` / `sora-2-pro`, `grok-imagine`, `happyhorse-1.0`). Toggle `audio: true` for integrated audio and, on `v6`, `multi_shot: true` for multi-shot storytelling. Native models also accept `off_peak_mode`, `preview_mode`, and `seed`; third-party models reject those flags. Every supported parameter is documented on [POST /videos/create](https://useapi.net/docs/api-pixverse-v2/post-pixverse-videos-create-v4).

## Image-to-video

To animate a still, set `first_frame_path` to a **local image path** (`.png`, `.jpeg`, `.jpg`, `.gif`, `.webp`) — the script uploads it via [POST /files](https://useapi.net/docs/api-pixverse-v2/post-pixverse-files) and passes the returned path. For image-to-video the `aspect_ratio` is derived from the image and must **not** be set. Local image paths in `prompts.json` are inputs **you** supply — they are not included in this repo.

---

Support: [Discord](https://discord.gg/w28uK3cnmF) · [Telegram](https://t.me/use_api) · [YouTube](https://www.youtube.com/@midjourneyapi)
