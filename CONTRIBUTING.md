# Contributing

Thanks for helping improve the MAQAMI Travel MCP server. This repository holds the documentation, the directory and client manifests, and the `maqami-travel` npm stdio bridge. The hosted server at `https://mcp.maqami.co/` is deployed separately.

## Good ways to help

- **Client setup guides.** If you connected the server from a client that isn't in the README, or a client changed its settings, open a pull request with the steps.
- **Bug reports.** Use the bug report form and include the client, its version and the error message.
- **Documentation fixes.** Typos, unclear steps, outdated screenshots or links.
- **Questions and ideas.** Use [Discussions](https://github.com/negm17111995/mcp-server/discussions).

Security issues go through [SECURITY.md](SECURITY.md), not public issues.

## Pull requests

1. Fork the repository and create a branch from `main`.
2. Keep each pull request focused on one change.
3. For changes to `index.js` or `test/`, run the tests:

   ```bash
   npm install
   npm test
   ```

   The tests start a local mock server and never call the live endpoint. Please don't add tests or scripts that call `https://mcp.maqami.co/`.
4. If you change a version number, update it everywhere: `package.json`, `server.json` (both `version` fields), `gemini-extension.json`, `plugin.json`, `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json` (both `version` fields), `.codex-plugin/plugin.json`, `mcpb/manifest.json` and `CITATION.cff`. `npm test` checks that they match.
5. Describe what you changed and how you checked it.

## Writing style

- Keep instructions short and testable: what to click or type, and what you should see.
- Describe what the tools do. Avoid claims about prices or coverage that the documentation can't back up.
- Never include real guest names, emails, payment details or booking IDs.

## Code of Conduct

This project follows the [Contributor Covenant](CODE_OF_CONDUCT.md). By taking part, you agree to follow it.
