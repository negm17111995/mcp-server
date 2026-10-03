# MAQAMI Travel MCP Server

Official MCP server for MAQAMI, a hotel and flight booking platform with 3M+ hotels. Search live hotel rates and flights, look up places, airports and hotel details, then prebook and book. Remote Streamable HTTP endpoint, no API key required.

## Connect

### Claude Desktop

Edit your Claude Desktop config file:
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "maqami-travel": {
      "url": "https://mcp.maqami.co/"
    }
  }
}
```

### Claude.ai Custom Connector

Add a custom connector in Claude.ai:

```
Name: MAQAMI Travel
URL: https://mcp.maqami.co/
```

### Claude Code

```bash
claude mcp add --transport http maqami-travel https://mcp.maqami.co/
```

### Cursor

Create or edit `.cursor/mcp.json` in your project root:

```json
{
  "mcpServers": {
    "maqami-travel": {
      "url": "https://mcp.maqami.co/"
    }
  }
}
```

### VS Code / Cline

Add to your Cline MCP settings:

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

Add via Settings → MCP Servers:

```json
{
  "mcpServers": {
    "maqami-travel": {
      "url": "https://mcp.maqami.co/"
    }
  }
}
```

### ChatGPT / OpenAI Agents SDK

Configure as a remote MCP server:

```json
{
  "mcpServers": {
    "maqami-travel": {
      "url": "https://mcp.maqami.co/",
      "transport": "streamable-http"
    }
  }
}
```

### Generic Streamable HTTP Clients

```
Endpoint: https://mcp.maqami.co/
Transport: Streamable HTTP (JSON-RPC over POST)
Authentication: None
```

### Local / stdio via npm

Install and run via npm:

```bash
npx -y maqami-travel
```

The npm package provides a stdio transport that proxies to the remote endpoint.

## What you can do

- **Search hotels** with live rates and availability across 3M+ hotels worldwide
- **Search flights** and compare fares
- **Look up places** (cities, landmarks, destinations) and airports
- **Get hotel details** including amenities, photos, and descriptions
- **Prebook** to lock in rates before final booking
- **Book** hotels and flights (creates real reservations and requires guest and payment details)

## Example prompts

> "Find me a 5-star hotel in Tokyo for March 15-17, 2 adults"

> "Search for flights from LAX to JFK on December 10"

> "Show me hotels near the Eiffel Tower with spa facilities"

> "What airports are near San Francisco?"

> "Book the Hilton Tokyo for my trip, guest name John Smith, email john@example.com"

## Privacy and security

No API key required. The remote endpoint at https://mcp.maqami.co/ is publicly accessible. Booking data and payment information are handled according to MAQAMI's privacy policy at https://maqami.co.

## License

MIT

## Support

Contact: info@maqami.co
