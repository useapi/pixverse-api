# PixVerse via useapi.net

This extension connects the hosted useapi.net PixVerse MCP server (`useapi-pixverse`, 38 tools). The tools make video from text, images, effect templates and keyframes, extend, lip-sync and upscale it, and generate images, music, music videos and speech, on the user's own PixVerse accounts.

- Endpoint: https://api.useapi.net/v2/pixverse/mcp (Streamable HTTP), authorized with the user's useapi.net API token in `USEAPI_TOKEN`.
- Before the tools work, the user needs a useapi.net API token (https://useapi.net/docs/start-here/setup-useapi) and an account connected at https://useapi.net/docs/start-here/setup-pixverse.
- If a tool returns 401, ask the user to check `USEAPI_TOKEN` (`gemini extensions config useapi-pixverse`). If it says no account is configured, point them to the setup page above.
- Generations spend the credits of the user's PixVerse plan; upscales and music videos take `quote: true` for a free price first. A 412 means the plan or credits do not allow the request. Ask before starting paid jobs, and report job status and links when they finish.
- Full tool list and limits: https://useapi.net/docs/api-pixverse-v2/mcp

useapi.net is a paid third-party API service ($15/month, covers every useapi.net API), not affiliated with PixVerse.
