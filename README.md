# PixVerse API examples (useapi.net)

Runnable Node.js examples for the [PixVerse API](https://useapi.net/docs/api-pixverse-v2) by [useapi.net](https://useapi.net/?utm_source=github&utm_medium=readme&utm_campaign=pixverse-api) — drive your own [PixVerse](https://pixverse.ai) account over a simple REST API. Generate **native PixVerse V6 / V5.x / C1** video (integrated audio, multi-shot, 900+ effect templates) plus the **frontier models PixVerse hosts** — **Seedance 2.0**, **Kling V3 / O3**, **Veo 3.1**, **Sora 2 / Sora 2 Pro**, **Grok Imagine**, **HappyHorse** — and images (**Nano Banana / 2 / Pro**, **GPT Image 2.0**, **Seedream 5.0**, **Qwen**). No developer account, no per-call metering.

Each example reads a list of prompts from `prompts.json`, submits them through the useapi.net PixVerse API, polls each task until it is final, and downloads every finished MP4 — so you can queue a batch and come back to the winners.

| Example | What it does | Tutorial |
|---|---|---|
| [`video/`](./video) | Batch-generate **PixVerse V6 / V5.x / C1** video — text-to-video and image-to-video — with integrated audio, multi-shot, and any hosted model (Seedance, Kling, Veo 3.1, Sora 2, Grok, HappyHorse) selectable per prompt | [How to Generate AI Video with PixVerse V6 via the PixVerse API](https://useapi.net/docs/articles/pixverse-demo) |

## Quick start

You need [Node.js](https://nodejs.org) v21 or newer (no dependencies to install), a useapi.net [API token](https://useapi.net/docs/start-here/setup-useapi?utm_source=github&utm_medium=readme&utm_campaign=pixverse-api), and a connected [PixVerse account](https://useapi.net/docs/start-here/setup-pixverse) (one [$15/month subscription](https://useapi.net/docs/subscription?utm_source=github&utm_medium=readme&utm_campaign=pixverse-api) covers every useapi.net API):

```bash
git clone https://github.com/useapi/pixverse-api.git
cd pixverse-api/video
node ./pixverse.mjs <API_TOKEN> <EMAIL>
```

`API_TOKEN` is your useapi.net token and `EMAIL` is your connected PixVerse account email — every script looks the account up by email automatically. Edit `prompts.json` in each folder to queue your own prompts. The PixVerse API is served under the `/v2/pixverse/...` base path; every supported parameter is documented on the [POST /videos/create](https://useapi.net/docs/api-pixverse-v2/post-pixverse-videos-create-v4) endpoint page.

## Tutorials

- [How to Generate AI Video with PixVerse V6 via the PixVerse API](https://useapi.net/docs/articles/pixverse-demo) — the two-call video workflow with copy-paste `curl`, the native + third-party model lineup, integrated audio, multi-shot, 900+ effect templates, pricing, and the runnable batch script

## About useapi.net

[useapi.net](https://useapi.net/?utm_source=github&utm_medium=readme&utm_campaign=pixverse-api) is an experimental REST API for AI services. The PixVerse API drives your own [PixVerse](https://pixverse.ai) account, so you spend your plan's credits at consumer rates instead of metered developer-API pricing. See the [model matrix](https://useapi.net/model-matrix?utm_source=github&utm_medium=readme&utm_campaign=pixverse-api) and pricing on the [API overview](https://useapi.net/docs/api-pixverse-v2).

Visit our [Discord Server](https://discord.gg/w28uK3cnmF) or [Telegram Channel](https://t.me/use_api) for any support questions and concerns.

We regularly post guides and tutorials on the [YouTube Channel](https://www.youtube.com/@midjourneyapi).
