# Animated GIFs with GPT Image 2.6 — PixVerse API (Node.js)

Make looping animated GIFs from a text prompt with GPT Image 2.6 (Flare and Sunburst) on your [PixVerse subscription](https://app.pixverse.ai/subscribe) through the [PixVerse API](https://useapi.net/docs/api-pixverse-v2?utm_source=github.com&utm_medium=referral&utm_campaign=pixverse-api) by [useapi.net](https://useapi.net/?utm_source=github.com&utm_medium=referral&utm_campaign=pixverse-api).

Full walkthrough: [How to Generate Animated GIFs with the GPT Image 2.6 API](https://useapi.net/docs/articles/gpt-image-2-6-gif-api?utm_source=github.com&utm_medium=referral&utm_campaign=pixverse-api)

<img src="https://media.useapi.net/pixverse/2026-11-23-gpt-image-2-6-gif-article/gpt-image-2-6-sunburst-gif-christmas-disco-576x1024.gif" alt="GPT Image 2.6 Sunburst animated GIF: a young woman with a mint pompadour, cat-eye glasses with blinking cartoon eyes and a red velvet Christmas coat dancing on a blue background" width="320">

`gpt-image-2.6-sunburst`, `576x1024`, 12 frames at 130 ms, `detail_level: high`, made from the first prompt in `prompts.json`.

See it run: [the GIFs in a 40-second YouTube Short](https://youtube.com/shorts/kEW-_EqlZZ8): the dancer, the pixel-art campfire and the paper boat made on Ultra for 0 credits, each with its prompt on screen.

For each job in `prompts.json`, `gif.mjs` sends [`POST /images/create`](https://useapi.net/docs/api-pixverse-v2/post-pixverse-images-create?utm_source=github.com&utm_medium=referral&utm_campaign=pixverse-api) with `output_format: "gif"`, polls [`GET /images/{image_id}`](https://useapi.net/docs/api-pixverse-v2/get-pixverse-images-image_id?utm_source=github.com&utm_medium=referral&utm_campaign=pixverse-api) every 5 seconds until `image_status_final` is `true`, and downloads the GIF to `output/<name>.gif`.

## Prerequisites

- [Node.js](https://nodejs.org) v21 or newer (no dependencies to install)
- A useapi.net [API token](https://useapi.net/docs/start-here/setup-useapi?utm_source=github.com&utm_medium=referral&utm_campaign=pixverse-api)
- A connected [PixVerse account](https://useapi.net/docs/start-here/setup-pixverse?utm_source=github.com&utm_medium=referral&utm_campaign=pixverse-api) on a paid PixVerse plan, Standard or higher. GPT Image 2.6 GIFs are free on Ultra

## Usage

```bash
export USEAPI_TOKEN=user:12345-...        # your useapi.net API token
export PIXVERSE_EMAIL=you@example.com     # optional: pick one connected PixVerse account
node ./gif.mjs [JOBS_FILE]
```

`JOBS_FILE` defaults to `prompts.json`. Without `PIXVERSE_EMAIL` the API picks one of your accounts with a free slot. When every account is busy the API answers `429` and the script waits 30 seconds and sends the same request again. Every step is logged to `gif_results.txt`.

## Jobs

`prompts.json` is an array of jobs. The three in it are the real prompts and settings from the walkthrough:

| Field | What it is |
|---|---|
| `name` | file name of the result, `output/<name>.gif` |
| `prompt` | what the GIF shows and how it moves |
| `model` | `gpt-image-2.6-flare` (fast iteration) or `gpt-image-2.6-sunburst` (detailed work) |
| `gif_frame_size` | width x height of every frame: `384x384`, `512x512`, `720x720`, `960x960`, `512x288`, `768x432`, `1024x576`, `288x512`, `432x768` or `576x1024` |
| `frame_count` | 2 to 16 frames; 9 at `960x960`, 12 at `1024x576` and `576x1024` (default 9) |
| `frame_duration_ms` | 20 to 2000 ms per frame, in steps of 10 (default 200) |
| `detail_level` | `low`, `medium`, `high`, `xhigh` or `max` (default `low`) |

Any other [POST /images/create](https://useapi.net/docs/api-pixverse-v2/post-pixverse-images-create?utm_source=github.com&utm_medium=referral&utm_campaign=pixverse-api) field, such as `complexity`, can be added to a job and is sent as it is. The loop lasts `frame_count` x `frame_duration_ms`.

## What you get

One GIF per job in `output/`, usually after 20 to 50 seconds. The walkthrough's three: the dancer above (`576x1024`), `campfire-fox` (`768x432`, 16 frames at 80 ms) and `ginger-cat` (`432x768`, 9 frames at 150 ms).

## Price

On PixVerse Ultra a GPT Image 2.6 GIF costs 0 credits. On Standard, Pro and Premium a GIF costs 18 credits at `low`, 32 at `medium`, 39 at `high`, 69 at `xhigh` and 154 at `max`, at any frame size, plus 5 credits for each reference image (as of November 2026). The script prints the credits charged when it starts each job.

useapi.net is a third-party API, not affiliated with OpenAI or PixVerse.
