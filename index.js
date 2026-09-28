#!/usr/bin/env node
/**
 * MAQAMI Travel MCP Server
 *
 * A fully functional MCP server (stdio transport) that proxies all tool calls
 * to the MAQAMI Travel backend at https://mcp.maqami.co/
 *
 * Endpoint: https://mcp.maqami.co/
 * No authentication required.
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const BACKEND_URL = "https://mcp.maqami.co/";

async function mcpRequest(method, params = {}) {
  const res = await fetch(BACKEND_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
    },
    body: JSON.stringify({ jsonrpc: "2.0", method, params, id: Date.now() }),
  });

  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("text/event-stream")) {
    const text = await res.text();
    for (const line of text.split("
")) {
      if (line.startsWith("data:")) {
        try {
          const json = JSON.parse(line.slice(5).trim());
          if (json.result !== undefined || json.error !== undefined) return json;
        } catch (_) {}
      }
    }
    throw new Error("No valid JSON-RPC result in SSE stream");
  }
  return res.json();
}

async function fetchTools() {
  const response = await mcpRequest("tools/list", {});
  if (response.error) throw new Error(`Backend error: ${JSON.stringify(response.error)}`);
  return response.result?.tools ?? [];
}

async function main() {
  let tools = [];
  try {
    tools = await fetchTools();
    process.stderr.write(`[maqami-mcp] Loaded ${tools.length} tools from backend
`);
  } catch (err) {
    process.stderr.write(`[maqami-mcp] Warning: Could not pre-fetch tools — ${err.message}
`);
  }

  const server = new Server(
    { name: "maqami-travel", version: "1.0.5" },
    { capabilities: { tools: {} } }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    if (tools.length === 0) tools = await fetchTools();
    return { tools };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    const response = await mcpRequest("tools/call", { name, arguments: args ?? {} });
    if (response.error) {
      return {
        content: [{ type: "text", text: `Error: ${response.error.message ?? JSON.stringify(response.error)}` }],
        isError: true,
      };
    }
    return response.result;
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
  process.stderr.write("[maqami-mcp] Server running on stdio
");
}

main().catch((err) => {
  process.stderr.write(`[maqami-mcp] Fatal: ${err.message}
`);
  process.exit(1);
});
