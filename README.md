# PixVerse API examples: PixVerse V6, Seedance 2.5, Veo 3.1, music videos (useapi.net)

Runnable Node.js examples for the [PixVerse API](https://useapi.net/docs/api-pixverse-v2?utm_source=github.com&utm_medium=referral&utm_campaign=pixverse-api) by [useapi.net](https://useapi.net/?utm_source=github.com&utm_medium=referral&utm_campaign=pixverse-api), a third-party REST API for [PixVerse](https://pixverse.ai) by AIsphere. It uses your [PixVerse subscription](https://app.pixverse.ai/subscribe): Free (Basic), Standard $10, Pro $30, Premium $60, Ultra $199 or Team Ultra $199 a seat a month (as of October 2026).

The API makes native PixVerse V6, V5.6, V5.5, V5, V5 Fast and C1 video (sound, multi-shot, more than 900 effect templates, Off-Peak mode) plus the models PixVerse hosts: Seedance 2.5, 2.5 Flash, 2.5 Draft, 2.0, 2.0 Fast and 2.0 Mini, Kling 4.0, O3 and 3.0, Veo 3.1 Lite, Standard and Fast, MiniMax H3 and H3 Max (Hailuo 3.0), Gemini Omni Flash, Grok Imagine and Grok Imagine 1.5, HappyHorse 1.0, FLUX 3 and Wan 3.0. It also turns a song into a lip-synced music video (PixVerse's One-Click MV), and makes images (Nano Banana Pro, 2.1, 2, 2 Lite and Nano Banana, GPT Image 2.5 Flare, 2.5 Sunburst and 2.0, Seedream 5.0 Pro, 5.0 Lite, 4.5 and 4.0, Qwen Image), music, speech and upscaling. PixVerse's own developer API sells only the PixVerse models, and its credits are kept apart from PixVerse subscriptions.

Each example reads a list of jobs from a JSON file (`prompts.json`, `music-videos.json`), submits them through the useapi.net PixVerse API, polls each task until it is final, and downloads every finished MP4, so you can queue a batch and come back to the winners.

| Example | What it does | Tutorial |
|---|---|---|
| [`video/`](./video) | Batch-generate PixVerse V6, V5.x and C1 video, text-to-video and image-to-video, with sound, multi-shot, and any hosted model (Seedance 2.5 and 2.0, Kling 4.0, O3 and 3.0, Veo 3.1, MiniMax H3, Grok Imagine, HappyHorse 1.0) selectable per prompt | [How to Generate AI Video with PixVerse V6 via the PixVerse API](https://useapi.net/docs/articles/pixverse-demo?utm_source=github.com&utm_medium=referral&utm_campaign=pixverse-api) |
| [`music-video/`](./music-video) | Turn a song and a character photo into a finished, lip-synced music video (PixVerse's One-Click MV): performance, expressive or storytelling, 720p or 1080p, with a free price quote first and every extra file downloaded | [How to Make an AI Music Video from a Song with the PixVerse API](https://useapi.net/docs/articles/pixverse-music-video-api?utm_source=github.com&utm_medium=referral&utm_campaign=pixverse-api) |
| [`gpt-image-2-6-gif/`](./gpt-image-2-6-gif) | Make looping animated GIFs from a text prompt with GPT Image 2.6 Flare and Sunburst: size, 2 to 16 frames, frame speed and detail level per prompt, free on PixVerse Ultra | [How to Generate Animated GIFs with the GPT Image 2.6 API](https://useapi.net/docs/articles/gpt-image-2-6-gif-api?utm_source=github.com&utm_medium=referral&utm_campaign=pixverse-api) |
| [`n8n/`](./n8n) | An n8n workflow: a Google Sheet queue (plus a form) that makes PixVerse V6, Seedance 2.5, Kling 4.0, Veo 3.1 and MiniMax H3 videos on your PixVerse accounts, writes each video id at once, and optionally saves the results to Google Drive | [PixVerse API](https://useapi.net/docs/api-pixverse-v2?utm_source=github.com&utm_medium=referral&utm_campaign=pixverse-api) |

## Quick start

You need [Node.js](https://nodejs.org) v21 or newer (no dependencies to install), a useapi.net [API token](https://useapi.net/docs/start-here/setup-useapi?utm_source=github.com&utm_medium=referral&utm_campaign=pixverse-api), and a connected [PixVerse account](https://useapi.net/docs/start-here/setup-pixverse?utm_source=github.com&utm_medium=referral&utm_campaign=pixverse-api) (one [$15/month subscription](https://useapi.net/docs/subscription?utm_source=github.com&utm_medium=referral&utm_campaign=pixverse-api) covers every useapi.net API):

```bash
git clone https://github.com/useapi/pixverse-api.git
cd pixverse-api/video
node ./pixverse.mjs <API_TOKEN> <EMAIL>
```

`API_TOKEN` is your useapi.net token and `EMAIL` is your connected PixVerse account email — every script looks the account up by email automatically. Edit `prompts.json` in each folder to queue your own prompts. The PixVerse API is served under the `/v2/pixverse/...` base path; every supported parameter is documented on the [POST /videos/create](https://useapi.net/docs/api-pixverse-v2/post-pixverse-videos-create-v4?utm_source=github.com&utm_medium=referral&utm_campaign=pixverse-api) endpoint page.

## MCP server

[![PixVerse MCP connector](https://glama.ai/mcp/connectors/net.useapi/pixverse/badges/score.svg)](https://glama.ai/mcp/connectors/net.useapi/pixverse)

useapi.net also runs a hosted [Model Context Protocol](https://modelcontextprotocol.io) server for PixVerse, so an AI assistant such as the Claude app, ChatGPT, Claude Code, Cursor or VS Code Copilot can use it on your PixVerse accounts. It has 38 tools: videos from text, an image, more than 900 effect templates, first and last frames, keyframes or reference images, with PixVerse's own models and third-party ones such as Seedance 2.5; extend, modify, lip-sync, motion control and upscale; images and image upscale; songs, music videos and speech; uploads, your PixVerse history and running jobs. Free price quotes (`quote: true`) for upscales and music videos. Nothing to install or run locally.

- Endpoint: `https://api.useapi.net/v2/pixverse/mcp`
- Transport: Streamable HTTP
- Authorization: your useapi.net API token in the `Authorization: Bearer …` header, and an account connected with the [PixVerse setup](https://useapi.net/docs/start-here/setup-pixverse?utm_source=github.com&utm_medium=referral&utm_campaign=pixverse-api). The Claude app and ChatGPT sign in with OAuth instead.
- Listed in the official MCP Registry as `net.useapi/pixverse`

Claude Code:

```bash
claude mcp add --transport http useapi-pixverse https://api.useapi.net/v2/pixverse/mcp --header "Authorization: Bearer YOUR_API_TOKEN"
```

Cursor, VS Code, Windsurf, the Claude app, ChatGPT and the full tool list: [PixVerse MCP server docs](https://useapi.net/docs/api-pixverse-v2/mcp?utm_source=github.com&utm_medium=referral&utm_campaign=pixverse-api). useapi.net is a third-party API, not affiliated with PixVerse.

## Use with Claude Code

This repo is also a Claude Code plugin marketplace. The plugin adds the hosted PixVerse MCP server, and reads your token from the `USEAPI_TOKEN` environment variable, so set it before you start Claude Code:

```bash
export USEAPI_TOKEN=user:12345-...      # your useapi.net API token
```

Then, inside Claude Code:

```
/plugin marketplace add useapi/pixverse-api
/plugin install pixverse@useapi-pixverse
```

On Claude Code 2.1.275 or later, `/plugin install pixverse --marketplace useapi/pixverse-api` does both in one step. Run `/mcp` to check that `useapi-pixverse` is connected.

## Use with Gemini CLI

This repo is also a Gemini CLI extension with the same MCP server:

```bash
gemini extensions install https://github.com/useapi/pixverse-api
```

The install asks for your useapi.net API token and keeps it in the system keychain. Change it later with `gemini extensions config useapi-pixverse`, and check the connection with `gemini mcp list`.

## Common questions

<!-- Mirrors the Questions block on useapi.net/docs/api-pixverse-v2 (2026-10-21, prices re-read 2026-11-15: PixVerse's price page, the subscribe page and BytePlus model pricing in a browser, all unchanged; PixVerse Ultra is now $199 / 30,000 credits, and Ultra takes 50% off Seedance 2.0 and 45% off 2.5 by default through useapi.net (unless the request sends relax_mode false, measured live 2026-11-15), so 5 s at 1080p on Ultra billed yearly ($1,788 / 12 / 30,000 = $0.0049667 a credit) is 225 credits = $1.12 and 468 credits = $2.32). Official: https://docs.platform.pixverse.ai/pixverse-api-pricing-2394995m0.md (225 credits = USD 1, V6 1080p with sound 23 credits/s = $0.102/s, no Off-Peak rate, read 2026-10-21), https://docs.platform.pixverse.ai/billing-and-usage-2394984m0.md (API credits kept separate from subscriptions), API access "Starting from $100" (Enterprise card on https://app.pixverse.ai/subscribe, read 2026-10-21). Ours: the overview calculator (V6 1080p with sound 20 credits/s; Premium $60 / 15,000 credits = $0.08/s, yearly $0.064/s, Off-Peak $0.04/s). Seedance 2.0 / 2.5 1080p 5 s on Premium yearly = $1.44 / $2.72 against BytePlus $1.87 / $2.84 (docs/articles/seedance-2-api-pricing.md). Free Basic: PixVerse models up to 540p, third-party video needs Pro or higher. The useapi.net subscription is not part of the per-video math. -->

### Does PixVerse have an API?

Through useapi.net, yes, and it runs on your PixVerse subscription, from video and images to music, speech, upscaling and more than 900 effects. PixVerse's own [developer API](https://docs.platform.pixverse.ai/billing-and-usage-2394984m0) bills separate API credits that a PixVerse subscription can't pay for, and PixVerse lists that API access from $100 (as of November 2026). [Setup PixVerse](https://useapi.net/docs/start-here/setup-pixverse?utm_source=github.com&utm_medium=referral&utm_campaign=pixverse-api) connects your account.

### How much does the PixVerse API cost?

Through useapi.net, PixVerse V6 at 1080p with sound costs $0.08 a second on Premium at $60 a month, $0.064 billed yearly and $0.04 in Off-Peak mode, against $0.102 on PixVerse's own [developer API](https://docs.platform.pixverse.ai/pixverse-api-pricing-2394995m0), which has no Off-Peak mode (as of November 2026). Off-Peak is free on Ultra. The [price table](https://useapi.net/docs/api-pixverse-v2?utm_source=github.com&utm_medium=referral&utm_campaign=pixverse-api#pricing) shows each model on each subscription.

### Do I need a PixVerse API key?

Through useapi.net, no PixVerse developer key: you use a useapi.net [API token](https://useapi.net/docs/start-here/setup-useapi?utm_source=github.com&utm_medium=referral&utm_campaign=pixverse-api) and connect your PixVerse account once with its email and password through [Setup PixVerse](https://useapi.net/docs/start-here/setup-pixverse?utm_source=github.com&utm_medium=referral&utm_campaign=pixverse-api). Sign up for PixVerse with an email address, since Gmail, Apple and Discord sign-in accounts aren't supported. A free Basic account runs the PixVerse models up to 540p, and the third-party video models need Pro or higher.

### Can the PixVerse API run Seedance 2.0 and Veo 3.1?

Through useapi.net, yes, from the same call as PixVerse V6: [POST videos/create](https://useapi.net/docs/api-pixverse-v2/post-pixverse-videos-create-v4?utm_source=github.com&utm_medium=referral&utm_campaign=pixverse-api) runs 20 third-party video models, among them Seedance 2.5, 2.5 Flash and 2.0, Kling 4.0 and O3, Veo 3.1 and MiniMax H3. On Premium billed yearly, a 5-second 1080p video costs $1.44 on Seedance 2.0 and $2.72 on Seedance 2.5, or $1.12 and $2.32 on Ultra billed yearly, where PixVerse's discounts apply by default, against $1.87 and $2.84 on ByteDance's official API (as of November 2026).

### How many PixVerse accounts can I connect?

Through useapi.net, each $15/month subscription covers 3 PixVerse accounts, and each extra $10/month subscription adds 3 more (as of October 2026). A request without `email` goes to one of your accounts with a free slot, within the `maxJobs` limit (1 to 8) you set for each account, so a batch spreads across all of them, and you get `429` when every account is busy.

More answers: [PixVerse API questions](https://useapi.net/docs/api-pixverse-v2?utm_source=github.com&utm_medium=referral&utm_campaign=pixverse-api#questions) and the [PixVerse V6 tutorial FAQ](https://useapi.net/docs/articles/pixverse-demo?utm_source=github.com&utm_medium=referral&utm_campaign=pixverse-api#frequently-asked-questions).

## Tutorials

- [How to Generate Animated GIFs with the GPT Image 2.6 API](https://useapi.net/docs/articles/gpt-image-2-6-gif-api?utm_source=github.com&utm_medium=referral&utm_campaign=pixverse-api): looping GPT Image 2.6 GIFs from a prompt, transparent PNG stickers, credit prices per detail level, and the runnable `gpt-image-2-6-gif/` script
- [How to Make an AI Music Video from a Song with the PixVerse API](https://useapi.net/docs/articles/pixverse-music-video-api?utm_source=github.com&utm_medium=referral&utm_campaign=pixverse-api): a full song and a character photo to a 1080p lip-synced music video, with the song made on Flow Music and the dancer on Nano Banana 2.1, pricing, and the runnable `music-video/` script
- [How to Generate AI Video with PixVerse V6 via the PixVerse API](https://useapi.net/docs/articles/pixverse-demo?utm_source=github.com&utm_medium=referral&utm_campaign=pixverse-api): the two-call video workflow with copy-paste `curl`, the native and third-party model lineup, sound, multi-shot, more than 900 effect templates, pricing, and the runnable batch script
- [Seedance 2.0 and 2.5 API Pricing: Every Route, Compared](https://useapi.net/docs/articles/seedance-2-api-pricing?utm_source=github.com&utm_medium=referral&utm_campaign=pixverse-api)
- [Sora 2 API Alternatives Compared, With Code: Seedance 2.5, Omni Flash, MiniMax H3, Kling v3](https://useapi.net/docs/articles/sora-2-api-alternatives?utm_source=github.com&utm_medium=referral&utm_campaign=pixverse-api)
- [AI Music APIs Compared: Mureka vs MiniMax vs ElevenLabs vs Lyria 3 Pro](https://useapi.net/docs/articles/ai-music-api-comparison?utm_source=github.com&utm_medium=referral&utm_campaign=pixverse-api)

## About useapi.net

[useapi.net](https://useapi.net/?utm_source=github.com&utm_medium=referral&utm_campaign=pixverse-api) is a third-party REST API for AI services. The PixVerse API runs on your [PixVerse subscription](https://app.pixverse.ai/subscribe), so you spend its credits at website rates instead of metered developer-API pricing. See the models and pricing on the [PixVerse API overview](https://useapi.net/docs/api-pixverse-v2?utm_source=github.com&utm_medium=referral&utm_campaign=pixverse-api).

Is PixVerse working right now? See the [status page](https://useapi.net/status?api=pixverse&utm_source=github.com&utm_medium=referral&utm_campaign=pixverse-api). Yesterday's success rates and job times across all customers are in the [daily stats](https://useapi.net/docs/account-management/get-stats-daily?type=pixverse&utm_source=github.com&utm_medium=referral&utm_campaign=pixverse-api).

Visit our [Discord Server](https://discord.gg/w28uK3cnmF) or [Telegram Channel](https://t.me/use_api) for any support questions and concerns.

We regularly post guides and tutorials on the [YouTube Channel](https://www.youtube.com/@useapi-net).

## License

The example code in this repository is released under the [MIT License](./LICENSE). It covers the example scripts only, not the useapi.net service or API.
