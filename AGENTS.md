# AGENTS.md

Guidance for coding agents and AI assistants that work with this repository or connect to the MAQAMI Travel MCP server.

## What this is

- **MAQAMI Travel MCP server**: a hosted MCP server for searching, prebooking and booking hotels and flights on [MAQAMI](https://maqami.co).
- **Endpoint**: `https://mcp.maqami.co/`
- **Transport**: Streamable HTTP
- **Authentication**: none for connecting. A booking needs guest and payment details.
- **Registry name**: `io.github.negm17111995/maqami-travel` (official MCP Registry)
- **npm**: `maqami-travel`, a stdio bridge for clients that cannot use remote servers

## Connecting

Use the remote endpoint whenever the client supports Streamable HTTP. Common configurations:

```json
{ "mcpServers": { "maqami-travel": { "url": "https://mcp.maqami.co/" } } }
```

```bash
claude mcp add --transport http maqami-travel https://mcp.maqami.co/
codex mcp add maqami-travel --url https://mcp.maqami.co/
gemini mcp add --transport http maqami-travel https://mcp.maqami.co/
```

Client-specific keys differ: VS Code uses `"servers"` with `"type": "http"`, Windsurf uses `"serverUrl"`, Gemini CLI settings use `"httpUrl"`, and Cline uses `"type": "streamableHttp"`. See [README.md](README.md#connect) for each client.

For stdio-only clients:

```json
{ "mcpServers": { "maqami-travel": { "command": "npx", "args": ["-y", "maqami-travel"] } } }
```

## Using the tools

Read the tool list from the server (`tools/list`); it is the source of truth for names and input schemas. The usual flows are:

- **Hotels**: find the destination (`get_data_places`) → search rates (`post_hotels_rates`) → hotel details (`get_data_hotel`, `get_data_reviews`) → prebook (`post_rates_prebook`) → confirm with the user → book (`post_rates_book`).
- **Flights**: find airports (`get_data_flights_airports`) → search (`post_flights_rates`) → verify (`post_flights_verify`) → confirm with the user → prebook (`post_flights_prebooks`) → book (`post_flights_bookings`).

Hotel rate searches need `checkin`, `checkout`, `occupancies`, `currency`, `guestNationality` and one location field. Flight searches need `legs` (each with `origin`, `destination` and `date`), `adults` and `currency`.

Recommended behaviour when acting for a user:

- Ask for missing inputs instead of guessing them.
- Report only prices, availability and policies returned by the tools.
- Tools without `readOnlyHint: true` change state. Prebook and book create real reservations. Show the user exactly what will be booked, including the final price, and wait for explicit confirmation before calling them.
- If a price or availability changes at prebook or verify, show the new result and ask again.

## Working on this repository

- The hosted server is deployed separately and is not in this repository. `index.js` is only the npm stdio bridge.
- Run the tests with `npm install && npm test`. They use a local mock server through `MAQAMI_MCP_URL` and never call the live endpoint. Do not point tests or scripts at `https://mcp.maqami.co/`.
- Keep versions in sync when releasing: `package.json`, `server.json` (both `version` fields), `gemini-extension.json`, `plugin.json` and `.claude-plugin/plugin.json`.
- Documentation should stay factual: describe what the tools do, and avoid unverifiable claims about prices or coverage.
- GitHub Actions is not used for checks at the moment. Run `npm test` locally before opening a pull request.
