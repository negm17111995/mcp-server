import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const ENDPOINT = "https://mcp.maqami.co/";

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

function json(path) {
  return JSON.parse(read(path));
}

const pkg = json("package.json");

test("every JSON manifest parses", () => {
  for (const path of [
    "server.json",
    "gemini-extension.json",
    "plugin.json",
    "mcp.json",
    ".mcp.json",
    "glama.json",
    ".claude-plugin/plugin.json",
    ".claude-plugin/marketplace.json",
    ".codex-plugin/plugin.json",
    "mcpb/manifest.json",
  ]) {
    assert.doesNotThrow(() => json(path), path);
  }
});

test("every manifest carries the package.json version", () => {
  const server = json("server.json");
  const marketplace = json(".claude-plugin/marketplace.json");
  const versions = {
    "server.json version": server.version,
    "server.json packages[0].version": server.packages[0].version,
    "gemini-extension.json": json("gemini-extension.json").version,
    "plugin.json": json("plugin.json").version,
    ".claude-plugin/plugin.json": json(".claude-plugin/plugin.json").version,
    ".claude-plugin/marketplace.json metadata": marketplace.metadata.version,
    ".claude-plugin/marketplace.json plugins[0]": marketplace.plugins[0].version,
    ".codex-plugin/plugin.json": json(".codex-plugin/plugin.json").version,
    "mcpb/manifest.json": json("mcpb/manifest.json").version,
    "CITATION.cff": read("CITATION.cff").match(/^version:\s*"?([^"\n]+)"?$/m)?.[1],
  };
  for (const [where, version] of Object.entries(versions)) {
    assert.equal(version, pkg.version, where);
  }
});

test("registry entry matches the npm package", () => {
  const server = json("server.json");
  assert.equal(server.name, pkg.mcpName);
  assert.equal(server.packages[0].identifier, pkg.name);
  assert.equal(server.packages[0].transport.type, "stdio");
  assert.deepEqual(server.remotes, [{ type: "streamable-http", url: ENDPOINT }]);
  assert.ok(server.description.length <= 100, "registry descriptions are limited to 100 characters");
});

test("every client config points at the hosted endpoint", () => {
  assert.equal(json("mcp.json").mcpServers["maqami-travel"].url, ENDPOINT);
  assert.equal(json(".mcp.json").mcpServers["maqami-travel"].url, ENDPOINT);
  assert.equal(json("gemini-extension.json").mcpServers["maqami-travel"].httpUrl, ENDPOINT);
});

test("the Codex plugin and marketplace point at files that exist", () => {
  const codex = json(".codex-plugin/plugin.json");
  for (const path of [codex.mcpServers, codex.interface.logo, codex.interface.composerIcon]) {
    assert.doesNotThrow(() => read(path.replace(/^\.\//, "")), path);
  }
  assert.doesNotThrow(() => read("skills/maqami-travel-booking/SKILL.md"));
  const marketplace = json(".claude-plugin/marketplace.json");
  assert.equal(marketplace.plugins[0].name, json(".claude-plugin/plugin.json").name);
});
