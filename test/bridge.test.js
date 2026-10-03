import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import {
  CallToolRequestSchema,
  GetPromptRequestSchema,
  ListPromptsRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
  isInitializeRequest,
} from "@modelcontextprotocol/sdk/types.js";

const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const bridgePath = fileURLToPath(new URL("../index.js", import.meta.url));

const seenSessionIds = new Set();

function createMockMcpServer() {
  const server = new Server(
    { name: "mock-remote", version: "0.0.0" },
    {
      capabilities: { tools: {}, resources: {}, prompts: {} },
      instructions: "Mock remote instructions",
    }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
      {
        name: "search_hotels",
        description: "Mock hotel search",
        inputSchema: {
          type: "object",
          properties: { city: { type: "string" } },
          required: ["city"],
        },
      },
    ],
  }));

  server.setRequestHandler(CallToolRequestSchema, async ({ params }) => {
    if (params.name !== "search_hotels") {
      return { content: [{ type: "text", text: `Unknown tool ${params.name}` }], isError: true };
    }
    return { content: [{ type: "text", text: `Hotels in ${params.arguments.city}` }] };
  });

  server.setRequestHandler(ListResourcesRequestSchema, async () => ({
    resources: [{ uri: "mock://info", name: "info" }],
  }));
  server.setRequestHandler(ReadResourceRequestSchema, async ({ params }) => ({
    contents: [{ uri: params.uri, text: "mock resource" }],
  }));
  server.setRequestHandler(ListPromptsRequestSchema, async () => ({
    prompts: [{ name: "plan_trip" }],
  }));
  server.setRequestHandler(GetPromptRequestSchema, async () => ({
    messages: [{ role: "user", content: { type: "text", text: "Plan a trip" } }],
  }));

  return server;
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => {
      try {
        resolve(data ? JSON.parse(data) : undefined);
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

// Stateful Streamable HTTP server: one transport per session, keyed by Mcp-Session-Id.
function startMockRemote() {
  const transports = new Map();

  const httpServer = createServer(async (req, res) => {
    try {
      const body = req.method === "POST" ? await readJsonBody(req) : undefined;
      const sessionId = req.headers["mcp-session-id"];
      let transport = sessionId ? transports.get(sessionId) : undefined;

      if (sessionId) seenSessionIds.add(sessionId);

      if (!transport) {
        if (sessionId || !isInitializeRequest(body)) {
          res.writeHead(sessionId ? 404 : 400).end();
          return;
        }
        transport = new StreamableHTTPServerTransport({
          sessionIdGenerator: () => randomUUID(),
          onsessioninitialized: (id) => transports.set(id, transport),
        });
        transport.onclose = () => transports.delete(transport.sessionId);
        await createMockMcpServer().connect(transport);
      }

      await transport.handleRequest(req, res, body);
    } catch (error) {
      if (!res.headersSent) res.writeHead(500).end(String(error));
    }
  });

  return new Promise((resolve) => {
    httpServer.listen(0, "127.0.0.1", () => {
      const { port } = httpServer.address();
      resolve({
        url: `http://127.0.0.1:${port}/`,
        close: async () => {
          for (const transport of transports.values()) await transport.close();
          httpServer.closeAllConnections();
          await new Promise((r) => httpServer.close(r));
        },
      });
    });
  });
}

let remote;
let client;

before(async () => {
  remote = await startMockRemote();
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [bridgePath],
    env: { ...process.env, MAQAMI_MCP_URL: remote.url },
    stderr: "inherit",
  });
  client = new Client({ name: "test-client", version: "0.0.0" });
  await client.connect(transport);
});

after(async () => {
  await client?.close();
  await remote?.close();
});

test("initialize reports the bridge identity and mirrors remote capabilities", () => {
  const info = client.getServerVersion();
  assert.equal(info.name, "maqami-travel");
  assert.equal(info.version, pkg.version);

  const caps = client.getServerCapabilities();
  assert.ok(caps.tools, "tools capability");
  assert.ok(caps.resources, "resources capability");
  assert.ok(caps.prompts, "prompts capability");
  assert.equal(client.getInstructions(), "Mock remote instructions");
});

test("tools/list is forwarded", async () => {
  const { tools } = await client.listTools();
  assert.deepEqual(
    tools.map((t) => t.name),
    ["search_hotels"]
  );
});

test("tools/call is forwarded with arguments", async () => {
  const result = await client.callTool({ name: "search_hotels", arguments: { city: "Dubai" } });
  assert.deepEqual(result.content, [{ type: "text", text: "Hotels in Dubai" }]);
  assert.ok(!result.isError);
});

test("tool errors from the remote pass through", async () => {
  const result = await client.callTool({ name: "nope", arguments: {} });
  assert.equal(result.isError, true);
});

test("resources and prompts are forwarded", async () => {
  const { resources } = await client.listResources();
  assert.equal(resources[0].uri, "mock://info");
  const { contents } = await client.readResource({ uri: "mock://info" });
  assert.equal(contents[0].text, "mock resource");

  const { prompts } = await client.listPrompts();
  assert.equal(prompts[0].name, "plan_trip");
  const prompt = await client.getPrompt({ name: "plan_trip" });
  assert.equal(prompt.messages[0].content.text, "Plan a trip");
});

test("requests after initialize carry the remote Mcp-Session-Id", () => {
  assert.equal(seenSessionIds.size, 1);
});
