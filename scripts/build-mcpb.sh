#!/usr/bin/env bash
# Builds dist/maqami-travel.mcpb, the Claude Desktop extension that wraps the stdio bridge.
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT

cp "$root/index.js" "$work/index.js"
cp "$root/assets/logo-512.png" "$work/icon.png"
node -e '
const fs = require("fs");
const pkg = require(process.argv[1] + "/package.json");
const manifest = require(process.argv[1] + "/mcpb/manifest.json");
manifest.version = pkg.version;
fs.writeFileSync(process.argv[2] + "/manifest.json", JSON.stringify(manifest, null, 2) + "\n");
const { name, version, description, type, license, dependencies } = pkg;
fs.writeFileSync(process.argv[2] + "/package.json", JSON.stringify({ name, version, description, type, license, dependencies }, null, 2) + "\n");
' "$root" "$work"

(cd "$work" && npm install --omit=dev --no-audit --no-fund --silent)
npx -y @anthropic-ai/mcpb@2.1.2 validate "$work/manifest.json"
mkdir -p "$root/dist"
npx -y @anthropic-ai/mcpb@2.1.2 pack "$work" "$root/dist/maqami-travel.mcpb"
