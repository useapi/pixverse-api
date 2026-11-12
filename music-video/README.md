# AI music videos from a song — PixVerse API (Node.js)

Turn a song and a character photo into a finished, lip-synced music video (PixVerse's One-Click MV) on your [PixVerse subscription](https://app.pixverse.ai/subscribe) through the [PixVerse API](https://useapi.net/docs/api-pixverse-v2?utm_source=github.com&utm_medium=referral&utm_campaign=pixverse-api) by [useapi.net](https://useapi.net/?utm_source=github.com&utm_medium=referral&utm_campaign=pixverse-api).

Full walkthrough: [How to Make an AI Music Video from a Song with the PixVerse API](https://useapi.net/docs/articles/pixverse-music-video-api?utm_source=github.com&utm_medium=referral&utm_campaign=pixverse-api)

Watch a 2½-minute 1080p result on YouTube: [AI music video from one song and one photo](https://youtu.be/VDKYSzk3JQI)

For each job in `music-videos.json`, `music-video.mjs` uploads the song and photos via [`POST /files`](https://useapi.net/docs/api-pixverse-v2/post-pixverse-files?utm_source=github.com&utm_medium=referral&utm_campaign=pixverse-api), asks [`POST /music-video/create`](https://useapi.net/docs/api-pixverse-v2/post-pixverse-music-video-create?utm_source=github.com&utm_medium=referral&utm_campaign=pixverse-api) for a free price quote, creates the music video, polls [`GET /music-video/{video_id}`](https://useapi.net/docs/api-pixverse-v2/get-pixverse-music-video-video_id?utm_source=github.com&utm_medium=referral&utm_campaign=pixverse-api) until it is done, and downloads the MP4 with its extra files: the same video without captions, the `.ass` subtitle file, and the key images and clips PixVerse cut together.

## Prerequisites

- [Node.js](https://nodejs.org) v21 or newer (no dependencies to install)
- A useapi.net [API token](https://useapi.net/docs/start-here/setup-useapi?utm_source=github.com&utm_medium=referral&utm_campaign=pixverse-api)
- A connected [PixVerse account](https://useapi.net/docs/start-here/setup-pixverse?utm_source=github.com&utm_medium=referral&utm_campaign=pixverse-api) email. Music videos work on every plan, the free Basic plan included

## Usage

```bash
node ./music-video.mjs <API_TOKEN> <EMAIL> [JOBS_FILE] [--quote]
```

`JOBS_FILE` defaults to `music-videos.json`. Run with `--quote` first: it prints the price of every job and creates nothing, since quotes are free. A 30-second song takes about 5 minutes to render, a 2½-minute song about 16. Each finished job lands in `output/<name>/`, and every step is logged to `music_video_results.txt`.

## Jobs

`music-videos.json` is an array of jobs:

| Field | What it is |
|---|---|
| `name` | folder name for the results |
| `song` | local MP3 or WAV, 10 seconds to 6 minutes, or a library song (`asset/music/material/audio/...`) |
| `character` | optional local photo (PNG, JPG, WebP) or a library character; a full-body photo with the face visible works best |
| `character_2` | optional second character, `storytelling` only |
| `style_image` | optional image whose look the whole video copies, with `style: custom` |
| `mode` | `performance` (lip-syncs the character to the vocals), `expressive` or `storytelling` (add a `prompt`) |
| `style`, `music_genre`, `subtitles`, `lyrics`, `prompt`, `aspect_ratio`, `quality` | passed as they are, see [POST /music-video/create](https://useapi.net/docs/api-pixverse-v2/post-pixverse-music-video-create?utm_source=github.com&utm_medium=referral&utm_campaign=pixverse-api) |

Library songs, characters and style images: [`GET /music-video/library`](https://useapi.net/docs/api-pixverse-v2/get-pixverse-music-video-library?utm_source=github.com&utm_medium=referral&utm_campaign=pixverse-api). Local songs and photos in `music-videos.json` are inputs you supply, they are not included in this repo.

## Price

PixVerse bills every second of the song: 10 credits a second at 720p and 15 at 1080p in `performance` and `expressive`, 20 and 40 in `storytelling`. A minute of song at 720p costs $2.40 on Premium and $3.00 on Pro, against $4.00 on PixVerse's own developer API, which has no `expressive` or `storytelling` mode (as of November 2026). The first music video on every PixVerse account is free, at any length and in 1080p, even on a free Basic plan. The quote shows it as `0 credits (free music video)`.

## Examples

Four real results with every prompt and request: [the walkthrough's examples](https://useapi.net/docs/articles/pixverse-music-video-api?utm_source=github.com&utm_medium=referral&utm_campaign=pixverse-api#example-a-2-minute-ai-music-video-made-from-one-song-on-a-free-account).
