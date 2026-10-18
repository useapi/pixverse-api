# PixVerse API examples: PixVerse V6, Seedance 2.5, Veo 3.1 (useapi.net)

Runnable Node.js examples for the [PixVerse API](https://useapi.net/docs/api-pixverse-v2?utm_source=github.com&utm_medium=referral&utm_campaign=pixverse-api) by [useapi.net](https://useapi.net/?utm_source=github.com&utm_medium=referral&utm_campaign=pixverse-api): generate **native PixVerse V6 / V5.x / C1** video (integrated audio, multi-shot, 900+ effect templates, Off-Peak pricing) plus the **models PixVerse hosts**, **Seedance 2.5 / 2.0**, **Kling O3 / V3**, **Veo 3.1**, **MiniMax H3** (Hailuo 3.0), **Gemini Omni Flash**, **Sora 2**, **Grok Imagine**, **HappyHorse**, **FLUX 3** and **Wan 3.0**, and images (**Nano Banana 2 / Pro**, **GPT Image 2.0**, **Seedream 5.0**, **Qwen**). It all runs through a simple REST API that drives your own [PixVerse](https://pixverse.ai) account, with no developer account or per-call metering.

Each example reads a list of prompts from `prompts.json`, submits them through the useapi.net PixVerse API, polls each task until it is final, and downloads every finished MP4 — so you can queue a batch and come back to the winners.

| Example | What it does | Tutorial |
|---|---|---|
| [`video/`](./video) | Batch-generate **PixVerse V6 / V5.x / C1** video — text-to-video and image-to-video — with integrated audio, multi-shot, and any hosted model (Seedance, Kling, Veo 3.1, Sora 2, Grok, HappyHorse) selectable per prompt | [How to Generate AI Video with PixVerse V6 via the PixVerse API](https://useapi.net/docs/articles/pixverse-demo) |

## Quick start

You need [Node.js](https://nodejs.org) v21 or newer (no dependencies to install), a useapi.net [API token](https://useapi.net/docs/start-here/setup-useapi?utm_source=github.com&utm_medium=referral&utm_campaign=pixverse-api), and a connected [PixVerse account](https://useapi.net/docs/start-here/setup-pixverse) (one [$15/month subscription](https://useapi.net/docs/subscription?utm_source=github.com&utm_medium=referral&utm_campaign=pixverse-api) covers every useapi.net API):

```bash
git clone https://github.com/useapi/pixverse-api.git
cd pixverse-api/video
node ./pixverse.mjs <API_TOKEN> <EMAIL>
```

`API_TOKEN` is your useapi.net token and `EMAIL` is your connected PixVerse account email — every script looks the account up by email automatically. Edit `prompts.json` in each folder to queue your own prompts. The PixVerse API is served under the `/v2/pixverse/...` base path; every supported parameter is documented on the [POST /videos/create](https://useapi.net/docs/api-pixverse-v2/post-pixverse-videos-create-v4) endpoint page.

## Common questions

<!-- Official API figures in these answers, verified 2026-10-18: https://docs.platform.pixverse.ai/pixverse-api-pricing-2394995m0.md (V6 1080p $0.080/s). Plan figures: useapi.net/docs/api-pixverse-v2 calculator. -->

- **Is there a PixVerse API?** Yes, and this repo uses the useapi.net PixVerse API, a third-party REST API that drives your own PixVerse website account on your web plan's credits: PixVerse V6 at 1080p costs about $0.064 a second on Premium, or $0.032 in Off-Peak mode, against $0.080 on PixVerse's own [developer API](https://docs.platform.pixverse.ai/pixverse-api-pricing-2394995m0) (as of October 2026). It also runs the full catalog of 900+ effects and the third-party models PixVerse hosts, which PixVerse's developer price list doesn't include, all from one endpoint. PixVerse sells its [official platform API](https://platform.pixverse.ai) on a separate API subscription.
- **Where do I get an API key?** You call this API with a useapi.net [API token](https://useapi.net/docs/start-here/setup-useapi?utm_source=github.com&utm_medium=referral&utm_campaign=pixverse-api) and connect your PixVerse account once with its email and password through the [PixVerse setup](https://useapi.net/docs/start-here/setup-pixverse?utm_source=github.com&utm_medium=referral&utm_campaign=pixverse-api). Sign up for PixVerse with an email address (Gmail, Apple and Discord sign-in accounts aren't supported). You don't need a key from PixVerse's developer platform.
- **How much does it cost?** A flat [$15/month](https://useapi.net/docs/subscription?utm_source=github.com&utm_medium=referral&utm_campaign=pixverse-api) to useapi.net, which covers every useapi.net API, plus your PixVerse plan: Pro at $30/month (6,000 credits), Premium at $60/month (15,000) or Ultra at $199/month (25,000), less on yearly billing. The third-party models need Pro or higher. Native PixVerse models run cheaper in Off-Peak mode (30% off on Pro, 50% off on Premium, free on Ultra). Seedance 2.5 at 720p is about $0.30 per second on Premium, and PixVerse V6 at 1080p about $0.064, against $0.080 on PixVerse's developer API (as of October 2026). See the [cost calculator](https://useapi.net/docs/api-pixverse-v2?utm_source=github.com&utm_medium=referral&utm_campaign=pixverse-api).
- **Which models can I use?** Native `v6` (default), `v5.6`, `v5.5`, `v5`, `v5-fast` and `pixverse-c1`, plus `seedance-2.5`, `seedance-2.0` / `-fast` / `-mini`, `kling-o3` / `kling-v3`, `veo-3.1-lite` / `-standard` / `-fast`, `minimax-h3`, `gemini-omni-flash`, `sora-2` / `sora-2-pro`, `grok-imagine` / `grok-imagine-1.5`, `happyhorse-1.0`, `flux-3.0` and `wan-3.0`, selectable per request on the same endpoint. See [model capabilities](https://useapi.net/docs/api-pixverse-v2/model-capabilities?utm_source=github.com&utm_medium=referral&utm_campaign=pixverse-api).
- **Can I make images, music and speech too?** Yes. The same account generates images with 15 models (several are unlimited in Relax Mode on Pro and higher), songs with MiniMax, ElevenLabs and Lyria 3 Pro, and text-to-speech with 300+ voices.
- **How many accounts can I connect?** Each useapi.net subscription covers 3 PixVerse accounts, and each extra $10/month subscription adds 3 more.
- More answers: [PixVerse API questions](https://useapi.net/docs/articles/pixverse-demo?utm_source=github.com&utm_medium=referral&utm_campaign=pixverse-api#frequently-asked-questions).

## Tutorials

- [How to Generate AI Video with PixVerse V6 via the PixVerse API](https://useapi.net/docs/articles/pixverse-demo) — the two-call video workflow with copy-paste `curl`, the native + third-party model lineup, integrated audio, multi-shot, 900+ effect templates, pricing, and the runnable batch script

## About useapi.net

[useapi.net](https://useapi.net/?utm_source=github.com&utm_medium=referral&utm_campaign=pixverse-api) is an experimental REST API for AI services. The PixVerse API drives your own [PixVerse](https://pixverse.ai) account, so you spend your plan's credits at consumer rates instead of metered developer-API pricing. See the [model matrix](https://useapi.net/model-matrix?utm_source=github.com&utm_medium=referral&utm_campaign=pixverse-api) and pricing on the [API overview](https://useapi.net/docs/api-pixverse-v2).

Visit our [Discord Server](https://discord.gg/w28uK3cnmF) or [Telegram Channel](https://t.me/use_api) for any support questions and concerns.

We regularly post guides and tutorials on the [YouTube Channel](https://www.youtube.com/@useapi-net).

## License

The example code in this repository is released under the [MIT License](./LICENSE). It covers the example scripts only, not the useapi.net service or API.
