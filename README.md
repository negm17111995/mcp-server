# MAQAMI Travel MCP Server

[![MAQAMI Travel MCP server on Glama](https://glama.ai/mcp/servers/negm17111995/mcp-server/badge)](https://glama.ai/mcp/servers/negm17111995/mcp-server)
[![npm version](https://img.shields.io/npm/v/maqami-travel)](https://www.npmjs.com/package/maqami-travel)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

Official MCP server for MAQAMI, a hotel and flight booking platform with 3M+ hotels. Search live hotel rates and flights, look up places, airports and hotel details, then prebook and book. Remote Streamable HTTP endpoint, no API key required.

```
https://mcp.maqami.co/
```

## Connect

The server is hosted at `https://mcp.maqami.co/` and uses the Streamable HTTP transport. There is nothing to install and no API key to configure.

### Claude (claude.ai and Claude Desktop)

Add MAQAMI as a custom connector:

1. Go to **Customize → Connectors**.
2. Click **+ Add**, then **Add custom connector**.
3. Enter the name `MAQAMI Travel` and the URL `https://mcp.maqami.co/`, then click **Continue**.
4. Under **Authentication**, choose **No sign in**, then click **Add**.

On Team and Enterprise plans, an Owner adds the connector under **Organization settings → Connectors** first.

### Claude Code

```bash
claude mcp add --transport http maqami-travel https://mcp.maqami.co/
```

### Cursor

Add to `~/.cursor/mcp.json` (global) or `.cursor/mcp.json` (project):

```json
{
  "mcpServers": {
    "maqami-travel": {
      "url": "https://mcp.maqami.co/"
    }
  }
}
```

Or install with one click by opening this link in your browser:

```text
cursor://anysphere.cursor-deeplink/mcp/install?name=maqami-travel&config=eyJ1cmwiOiJodHRwczovL21jcC5tYXFhbWkuY28vIn0=
```

### VS Code

Add to `.vscode/mcp.json` in your workspace:

```json
{
  "servers": {
    "maqami-travel": {
      "type": "http",
      "url": "https://mcp.maqami.co/"
    }
  }
}
```

Or add it to your user profile from the command line:

```bash
code --add-mcp '{"name":"maqami-travel","type":"http","url":"https://mcp.maqami.co/"}'
```

### Cline

In the Cline panel, open **MCP Servers → Remote Servers**, enter the URL `https://mcp.maqami.co/` and choose **Streamable HTTP**. Or add it to the MCP settings JSON:

```json
{
  "mcpServers": {
    "maqami-travel": {
      "type": "streamableHttp",
      "url": "https://mcp.maqami.co/"
    }
  }
}
```

### Windsurf

Open `mcp_config.json` from the **…** menu in the Cascade panel (**Open MCP config file**) and add:

```json
{
  "mcpServers": {
    "maqami-travel": {
      "serverUrl": "https://mcp.maqami.co/"
    }
  }
}
```

On current releases the file is at `~/.config/devin/mcp_config.json` (macOS and Linux) or `%APPDATA%\devin\mcp_config.json` (Windows). Older releases use `~/.codeium/windsurf/mcp_config.json`.

### ChatGPT

Custom MCP apps are available on the web for Plus, Pro, Business, Enterprise and Education accounts.

1. Open **Settings → Security and login** and turn on **Developer mode**.
2. Open **Plugins**, select the **+** button and create a developer-mode app.
3. Enter the name `MAQAMI Travel` and the URL `https://mcp.maqami.co/`, and choose **No Authentication**.
4. In a conversation, choose **Developer mode** from the **+** menu and select MAQAMI Travel.

### OpenAI Codex

```bash
codex mcp add maqami-travel --url https://mcp.maqami.co/
```

Or add to `~/.codex/config.toml`:

```toml
[mcp_servers.maqami-travel]
url = "https://mcp.maqami.co/"
```

### Gemini CLI

Install the extension, which adds the server and its context file:

```bash
gemini extensions install https://github.com/negm17111995/mcp-server
```

Or add only the server:

```bash
gemini mcp add --transport http maqami-travel https://mcp.maqami.co/
```

Or add to `~/.gemini/settings.json`:

```json
{
  "mcpServers": {
    "maqami-travel": {
      "httpUrl": "https://mcp.maqami.co/"
    }
  }
}
```

### OpenAI Agents SDK (Python)

```python
import asyncio

from agents import Agent, Runner
from agents.mcp import MCPServerStreamableHttp


async def main() -> None:
    async with MCPServerStreamableHttp(
        name="MAQAMI Travel",
        params={"url": "https://mcp.maqami.co/"},
    ) as maqami:
        agent = Agent(name="Travel assistant", mcp_servers=[maqami])
        result = await Runner.run(agent, "Find 4-star hotels in Lisbon for 2 adults, 12 to 15 May.")
        print(result.final_output)


asyncio.run(main())
```

### Other Streamable HTTP clients

| Setting   | Value                    |
| --------- | ------------------------ |
| URL       | `https://mcp.maqami.co/` |
| Transport | Streamable HTTP          |
| Auth      | None                     |

### Local stdio (npm)

For clients that only support stdio servers, the `maqami-travel` npm package is a thin bridge to the remote endpoint. It runs no booking logic locally and needs no credentials. Node.js 18 or later is required.

```json
{
  "mcpServers": {
    "maqami-travel": {
      "command": "npx",
      "args": ["-y", "maqami-travel"]
    }
  }
}
```

This works in `claude_desktop_config.json` and any other client that launches stdio servers.

## What you can do

- **Search hotels** with live rates and availability.
- **Search flights** and compare fares.
- **Look up places, airports and hotel details**, including amenities and photos.
- **Prebook** a hotel or flight rate to confirm price and availability.
- **Book** the prebooked rate. Booking creates a real reservation and requires guest and payment details.

## Example prompts

- "Find 5-star hotels in Istanbul for 15 to 17 August, 2 adults."
- "Show me the amenities and photos for the second hotel."
- "Search flights from Dubai to London on 10 December for one adult."
- "Which airports serve Tokyo?"
- "Prebook that room and confirm the final price before I book."

## Privacy and security

- No API key or account is required to connect.
- All traffic to `https://mcp.maqami.co/` is encrypted over HTTPS.
- Searches and bookings are processed by MAQAMI. Guest and payment details you provide for a booking are handled according to the policies published at [maqami.co](https://maqami.co).
- Booking creates a real reservation. Review the details and final price before confirming.

## Development

The repository contains the npm stdio bridge (`index.js`). The hosted server is deployed separately.

```bash
npm install
npm test
```

The tests start a local mock Streamable HTTP server and point the bridge at it with the `MAQAMI_MCP_URL` environment variable. That variable exists for testing only; by default the bridge connects to `https://mcp.maqami.co/`.

## License

[MIT](LICENSE)

## Support

Questions or issues: [info@maqami.co](mailto:info@maqami.co) or [open an issue](https://github.com/negm17111995/mcp-server/issues).
