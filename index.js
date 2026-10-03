#!/usr/bin/env node
/**
 * MAQAMI Travel MCP - stdio bridge.
 *
 * Exposes the remote MAQAMI Streamable HTTP endpoint (https://mcp.maqami.co/)
 * as a local stdio MCP server. No server logic runs locally; every request is
 * forwarded to the remote endpoint over the official MCP SDK client transport.
 */

import { readFileSync } from "node:fs";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import {
  CallToolRequestSchema,
  CallToolResultSchema,
  GetPromptRequestSchema,
  ListPromptsRequestSchema,
  ListResourcesRequestSchema,
  ListResourceTemplatesRequestSchema,
  ListToolsRequestSchema,
  PromptListChangedNotificationSchema,
  ReadResourceRequestSchema,
  ResourceListChangedNotificationSchema,
  ToolListChangedNotificationSchema,
} from "@modelcontextprotocol/sdk/types.js";

const pkg = JSON.parse(readFileSync(new URL("./package.json", import.meta.url), "utf8"));

const DEFAULT_URL = "https://mcp.maqami.co/";
// MAQAMI_MCP_URL is intended for testing against a local mock server.
const REMOTE_URL = process.env.MAQAMI_MCP_URL || DEFAULT_URL;

function log(message) {
  process.stderr.write(`[maqami-travel] ${message}\n`);
}

async function connectRemote() {
  const client = new Client({ name: `${pkg.name}-bridge`, version: pkg.version });
  await client.connect(new StreamableHTTPClientTransport(new URL(REMOTE_URL)));
  client.onerror = (error) => log(`Remote error: ${error.message}`);
  return client;
}

function createBridgeServer(remote) {
  const remoteCaps = remote.getServerCapabilities() ?? {};

  const capabilities = {};
  if (remoteCaps.tools) capabilities.tools = { listChanged: !!remoteCaps.tools.listChanged };
  if (remoteCaps.resources) capabilities.resources = { listChanged: !!remoteCaps.resources.listChanged };
  if (remoteCaps.prompts) capabilities.prompts = { listChanged: !!remoteCaps.prompts.listChanged };

  const server = new Server(
    { name: pkg.name, version: pkg.version },
    { capabilities, instructions: remote.getInstructions() }
  );

  if (remoteCaps.tools) {
    server.setRequestHandler(ListToolsRequestSchema, (req) => remote.listTools(req.params));
    // Forward tools/call as a raw request so results pass through unmodified.
    server.setRequestHandler(CallToolRequestSchema, (req) =>
      remote.request({ method: "tools/call", params: req.params }, CallToolResultSchema)
    );
    remote.setNotificationHandler(ToolListChangedNotificationSchema, () => server.sendToolListChanged());
  }

  if (remoteCaps.resources) {
    server.setRequestHandler(ListResourcesRequestSchema, (req) => remote.listResources(req.params));
    server.setRequestHandler(ListResourceTemplatesRequestSchema, (req) =>
      remote.listResourceTemplates(req.params)
    );
    server.setRequestHandler(ReadResourceRequestSchema, (req) => remote.readResource(req.params));
    remote.setNotificationHandler(ResourceListChangedNotificationSchema, () =>
      server.sendResourceListChanged()
    );
  }

  if (remoteCaps.prompts) {
    server.setRequestHandler(ListPromptsRequestSchema, (req) => remote.listPrompts(req.params));
    server.setRequestHandler(GetPromptRequestSchema, (req) => remote.getPrompt(req.params));
    remote.setNotificationHandler(PromptListChangedNotificationSchema, () => server.sendPromptListChanged());
  }

  return server;
}

async function main() {
  let remote;
  try {
    remote = await connectRemote();
  } catch (error) {
    log(`Could not connect to ${REMOTE_URL}: ${error.message}`);
    process.exit(1);
  }

  const server = createBridgeServer(remote);
  server.onerror = (error) => log(`Local error: ${error.message}`);

  let shuttingDown = false;
  const shutdown = async (code = 0) => {
    if (shuttingDown) return;
    shuttingDown = true;
    await remote.close().catch(() => {});
    process.exit(code);
  };

  server.onclose = () => shutdown(0);
  remote.onclose = () => {
    if (shuttingDown) return;
    log("Remote connection closed");
    shutdown(1);
  };
  process.on("SIGINT", () => shutdown(0));
  process.on("SIGTERM", () => shutdown(0));
  process.stdin.on("end", () => shutdown(0));

  await server.connect(new StdioServerTransport());
  log(`v${pkg.version} bridging stdio to ${REMOTE_URL}`);
}

main().catch((error) => {
  log(`Fatal: ${error.message}`);
  process.exit(1);
});
