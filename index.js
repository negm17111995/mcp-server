#!/usr/bin/env node
/**
 * MAQAMI Travel MCP Server
 * Stdio transport that proxies all tool calls to https://mcp.maqami.co/
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
    const lines = text.split("\n");
    for (const line of lines) {
      if (line.startsWith("data:")) {
        try {
          const parsed = JSON.parse(line.slice(5).trim());
          if (parsed.result !== undefined || parsed.error !== undefined) {
            return parsed;
          }
        } catch (_) {}
      }
    }
    throw new Error("No valid JSON-RPC result in SSE stream");
  }

  return res.json();
}

async function fetchTools() {
  const response = await mcpRequest("tools/list", {});
  if (response.error) {
    throw new Error("Backend error: " + JSON.stringify(response.error));
  }
  return response.result?.tools ?? [];
}

async function main() {
  let tools = [];

  try {
    tools = await fetchTools();
    process.stderr.write("[maqami-mcp] Loaded " + tools.length + " tools\n");
  } catch (err) {
    process.stderr.write("[maqami-mcp] Warning: " + err.message + "\n");
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
        content: [{ type: "text", text: "Error: " + (response.error.message ?? JSON.stringify(response.error)) }],
        isError: true,
      };
    }
    return response.result;
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
  process.stderr.write("[maqami-mcp] Server running on stdio\n");
}

main().catch((err) => {
  process.stderr.write("[maqami-mcp] Fatal: " + err.message + "\n");
  process.exit(1);
});
