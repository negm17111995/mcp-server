# AGENTS.md

Guidance for coding agents and AI assistants that work with this repository or connect to the MAQAMI Travel MCP server.

## What this is

- **MAQAMI Travel MCP server**: a hosted MCP server for searching hotels and flights on [MAQAMI](https://maqami.co) and sending the customer a secure checkout link on book.maqami.co.
- **Endpoint**: `https://mcp.maqami.co/`
- **Transport**: Streamable HTTP
- **Authentication**: none.
- **Payment**: only on book.maqami.co. The server never takes payment; no tool accepts payment details.
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

- **Hotels**: search rates by city, coordinates, airport, hotel IDs or `aiSearch` (`post_hotels_rates`) → hotel details (`get_data_hotel`, `get_data_reviews`) → confirm with the user → prebook (`post_rates_prebook`) → give the customer the `checkoutUrl` (`https://book.maqami.co/booking?prebookId=...`).
- **Flights**: find airports (`get_data_flights_airports`) → search (`post_flights_rates`) → confirm with the user → verify (`post_flights_verify`) → give the customer the `checkoutUrl` (`https://book.maqami.co/flights/booking?offerId=...`).
- **Existing bookings**: lookup, amend and cancel tools (for example `get_bookings_bookingid`, `cancel_hotel_booking`) need the booking ID and the email used to book.

Hotel rate searches need `checkin`, `checkout`, `occupancies`, `currency`, `guestNationality` and one location field (`cityName` with `countryCode`, `latitude` and `longitude`, `iataCode`, `hotelIds` or `aiSearch`). There is no places search. Flight searches need `legs` (each with `origin`, `destination` and `date`), `adults` and `currency`.

Recommended behaviour when acting for a user:

- Ask for missing inputs instead of guessing them.
- Report only prices, availability and policies returned by the tools.
- Tools without `readOnlyHint: true` change state: prebook holds a real rate, and the amend and cancel tools change real bookings. Show the user exactly what will happen, including the final price, and wait for explicit confirmation.
- Send the customer only a `checkoutUrl` or `searchUrl` on `book.maqami.co` that a tool returned. Never ask for card or passport details in the chat.
- If a price or availability changes at prebook or verify, show the new result and ask again.
- Pass hotel `offerId`s exactly as the search returned them. The server signs them and rejects changed or rebuilt ones; run the search again if one is rejected.
- Only the tools in `tools/list` exist; the server rejects other names.

## Working on this repository

- The hosted server is deployed separately and is not in this repository. `index.js` is only the npm stdio bridge.
- Run the tests with `npm install && npm test`. They use a local mock server through `MAQAMI_MCP_URL` and never call the live endpoint. Do not point tests or scripts at `https://mcp.maqami.co/`.
- Keep versions in sync when releasing: `package.json`, `server.json` (both `version` fields), `gemini-extension.json`, `plugin.json` and `.claude-plugin/plugin.json`.
- Documentation should stay factual: describe what the tools do, and avoid unverifiable claims about prices or coverage.
- GitHub Actions is not used for checks at the moment. Run `npm test` locally before opening a pull request.
