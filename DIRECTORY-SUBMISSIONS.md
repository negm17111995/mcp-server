# MAQAMI MCP Directory Submission Guide

To get worldwide distribution, you need to submit your server to the major AI agent directories. These are the places AI developers go to find tools to give to their agents.

## 1. Smithery (The Largest MCP Registry)
**URL:** https://smithery.ai/

Smithery is currently the largest community-driven registry of MCP servers.
- Go to Smithery.ai and click "Submit Server"
- **GitHub URL:** `https://github.com/negm17111995/mcp-server`
- **Name:** MAQAMI Travel
- **Description:** Book hotels worldwide — search, price, prebook & book across 249 countries. 65 tools for hotel search, flights, loyalty, analytics.
- **Transport:** SSE (Server-Sent Events) / HTTP
- **URL:** `https://mcp.maqami.co/`

## 2. MCP.so
**URL:** https://mcp.so/

MCP.so is another popular directory for finding MCP servers.
- Submit via their GitHub or submission form.
- Use the exact same name and description as above.
- **Category:** Travel / Booking
- **Authentication:** None (Public Endpoint)

## 3. Pulze
**URL:** https://pulze.ai/

Pulze is building a marketplace for agentic tools.
- **Name:** MAQAMI Travel MCP
- **Endpoint:** `https://mcp.maqami.co/`
- **Capabilities:** Hotel search, live pricing, hotel booking, flight search, loyalty management.

## 4. Claude's Official Directory (Coming Soon)
Anthropic has announced they are building an official directory/marketplace for Claude. By having `/.well-known/mcp.json` on `maqami.co`, you are already pre-positioned. 
When they launch their submission form, use the `README.md` in this repository as your submission text.

## 5. Dev.to / Medium Article (Developer Outreach)
Publishing an article is the #1 way to drive adoption right now because the space is so new.

**Suggested Title:** "How to Let Claude Book Hotels for You (Building an AI Travel Agent in 5 Minutes)"

**Outline:**
1. **The Problem:** AI agents are smart but they can't take action in the real world (like booking a hotel).
2. **The Solution:** We built the MAQAMI Travel MCP Server to expose our 2M+ hotel inventory directly to AI agents.
3. **How it Works (The Magic):** Show the 3-line JSON config.
4. **Demo Conversation:** Show an example of asking Claude to find a hotel in Dubai and watching it use `post_hotels_rates` and `get_data_hotel`.
5. **Call to Action:** "Connect your agent today at mcp.maqami.co — no API keys required."

*You can copy-paste sections from the `README.md` to write this article very quickly.*
