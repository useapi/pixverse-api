# n8n workflow for the PixVerse API

## PixVerse video queue in Google Sheets: Seedance 2.5, PixVerse V6, Kling 4.0, Veo 3.1 and MiniMax H3 on your PixVerse accounts

[`pixverse-sheet-batch.json`](./pixverse-sheet-batch.json) is a ready-to-import [n8n](https://n8n.io) workflow that turns a Google Sheet into a PixVerse video queue and keeps your PixVerse accounts busy. Each row is one video, from text or from an image, and the `model` column picks Seedance 2.5, Seedance 2.5 Flash, PixVerse V6, Kling 4.0, Veo 3.1 (Fast, Lite or Standard) or MiniMax H3 (or H3 Max) per row. It runs through the [useapi.net PixVerse API](https://useapi.net/docs/api-pixverse-v2?utm_source=github.com&utm_medium=referral&utm_campaign=pixverse-api), a third-party API, not affiliated with PixVerse, on your own PixVerse plan and the PixVerse accounts you connect there. It is built from core n8n nodes, with no community nodes.

Also on n8n.io: [Queue and render PixVerse Seedance videos with Google Sheets and Drive](https://n8n.io/workflows/23614)

You need a useapi.net subscription ($15 a month) and your PixVerse plan [connected at useapi.net](https://useapi.net/docs/start-here/setup-pixverse?utm_source=github.com&utm_medium=referral&utm_campaign=pixverse-api).

![The workflow](./pixverse-sheet-batch-00-canvas.png)

1. The sheet has one row per video: `prompt`, an optional `image_url` (image-to-video), and `model`, `quality`, `duration` and `aspect_ratio` (empty cells take the defaults in **Settings**). Copy the columns from [`pixverse-queue-sheet.csv`](./pixverse-queue-sheet.csv) into a tab named `PixVerse queue`.
2. The form is optional. Paste many prompts at once, one per line. Add `|` and an image link after a prompt to animate that image. Each line becomes a `new` row.
3. Every 3 minutes, the workflow reads your accounts, their free job slots and the sheet (free calls), checks each `new` row against the [model's limits](https://useapi.net/docs/api-pixverse-v2/model-capabilities?utm_source=github.com&utm_medium=referral&utm_campaign=pixverse-api), and starts it. A row without `email` goes to one of your PixVerse accounts that has a free job slot: the API picks it. A row with `email` runs on that account. At most `maxStartsPerTick` jobs start per tick (default 10), and never more than your accounts have free slots.
4. For an image row, the image is downloaded and uploaded to PixVerse first, then used as the first frame. A failure there costs nothing.
5. The same tick writes the `video_id` and the account into the row, so a restart or a late tick reads the video instead of paying twice.
6. Finished rows get the video link in `video_url` and, with `saveToDrive` on (the default), a copy in Google Drive with its link in `drive_link`.

| `status` | What happens next |
|---|---|
| `new` (or empty) | the row is checked (model, quality, duration, aspect ratio, prompt length, image link, account), then started → `rendering`. A row that fails the check gets `error` and a note that says what to fix |
| `rendering` | the video is read on its account. When it is done → `done`, with `video_url` and `drive_link`. A video still being made writes nothing |
| `done` | finished. Set it back to `new` to make it again |
| `error` | PixVerse refused it, a value is wrong, or the account's login failed: the `note` says what to change. Then set it to `new` |
| `check job` | the start may have used credits (a `5xx` other than `596`, or no answer), so it was not sent again. A `rendering` row also gets it when its `video_id` is empty, when the video is still not ready `giveUpAfterMinutes` (default 90) after the start, or when it finished without a link. Check PixVerse before you set it back to `new` |

### Errors

`429` (every account, or the pinned one, is at its job limit) means nothing was made: the row stays `new` and the next tick sends it again. A `400`, a `404` (the `email` is not a connected PixVerse account), a `412` (not enough PixVerse credits, nothing charged), a `422` (PixVerse moderation refused the prompt, nothing made), a `401` or `402` (the token or the useapi.net subscription) and a `596` (the account's PixVerse login failed, nothing made) set `error` with the API's own words. Any other `5xx`, or no answer, may already have started the job and used credits: the row goes to `check job` and is never resent. A finished video with a status other than `COMPLETED` (for example `MODERATED`) sets `error`. n8n's own retry is off on **Start video** (the paid POST) and on for the free reads and uploads.

### The token stays in n8n

The video links in the sheet are PixVerse's own CDN links, and the workflow downloads them for Google Drive without your useapi.net credential. Turn on `saveToDrive` (it is on by default) to keep the files.

### Setup

1. Get a [useapi.net API token](https://useapi.net/docs/start-here/setup-useapi?utm_source=github.com&utm_medium=referral&utm_campaign=pixverse-api) and connect your PixVerse accounts with the [PixVerse setup](https://useapi.net/docs/start-here/setup-pixverse?utm_source=github.com&utm_medium=referral&utm_campaign=pixverse-api). Set each account's `maxJobs` there: that is how many jobs it runs at once.
2. In n8n, import `pixverse-sheet-batch.json`.
3. Create a **Header Auth** credential: Name `Authorization`, Value `Bearer <your API token>`. Select it on the useapi.net HTTP Request nodes (**Accounts**, **Free slots**, **Upload image**, **Start video**, **Read video**). **Download image** and **Download video** need none.
4. Make a Google Sheet with a `PixVerse queue` tab and the columns from [`pixverse-queue-sheet.csv`](./pixverse-queue-sheet.csv). Put its id (the part of the URL between `/d/` and `/edit`) in `sheetId` at the top of **Settings**, and connect a Google Sheets credential to **Read rows**, **Update row** and **Append rows**.
5. Optional: set `driveFolderId` in **Settings** (empty is the root of My Drive), or `saveToDrive: false` to skip Drive. Otherwise connect Google Drive to **Upload to Drive**.
6. Create a **Basic Auth** credential (any username and password) and select it on **Add to the PixVerse queue**, so nobody else can add jobs to your accounts.
7. Publish (activate) the workflow. Add rows to the sheet, or open the form URL and sign in with that username and password.

### Requirements

You need a useapi.net subscription and one or more PixVerse accounts with enough PixVerse credits for the videos you queue (a `412` says when an account is short). Seedance 2.5, Kling 4.0, Veo 3.1 and MiniMax H3 are models PixVerse hosts, so they use the same PixVerse credits.

### Customize

The defaults (model, quality, duration, aspect ratio), the per-tick limits (`maxStartsPerTick`, `maxPollsPerTick`), `giveUpAfterMinutes` and the Drive folder are at the top of **Settings**. The schedule is on **Every 3 minutes**. The per-model limits are in the `MODELS` list in **Plan the tick**: edit it when PixVerse changes them. Every request parameter is documented on [POST videos/create](https://useapi.net/docs/api-pixverse-v2/post-pixverse-videos-create-v4?utm_source=github.com&utm_medium=referral&utm_campaign=pixverse-api), and the limits per model are on the [model capabilities](https://useapi.net/docs/api-pixverse-v2/model-capabilities?utm_source=github.com&utm_medium=referral&utm_campaign=pixverse-api) page.

Every endpoint is documented in the [PixVerse API reference](https://useapi.net/docs/api-pixverse-v2?utm_source=github.com&utm_medium=referral&utm_campaign=pixverse-api).
