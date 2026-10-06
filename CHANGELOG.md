# Changelog

All notable changes to the `maqami-travel` npm package, registry metadata and documentation.

## [Unreleased]

### Added
- Documentation only: quick start table, agent booking flow and FAQ in the README, `AGENTS.md`, `llms.txt`, `SECURITY.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, issue forms and `CITATION.cff`. No changes to `index.js` or the hosted server.

- Plugin packaging only: `.claude-plugin/marketplace.json` (Claude Code marketplace `maqami`), `.codex-plugin/plugin.json` with `assets/logo-512.png` (Codex plugin), and the `maqami-travel-booking` skill in `skills/`. No changes to `index.js` or the hosted server.

### Changed
- `maqami-travel-booking` skill: new "Untrusted content" and "Payments" sections, and the confirm-before-booking rules now also cover amend, cancel and extra-charge tools. Documentation only.

### Removed
- `DIRECTORY-SUBMISSIONS.md` (internal notes).

## [1.0.6] - 2026-10-03

### Changed
- `index.js` is now a stdio-to-Streamable-HTTP bridge built on the official MCP SDK client. It performs the full `initialize` handshake with `https://mcp.maqami.co/`, keeps the `Mcp-Session-Id`, and forwards tools, resources and prompts.
- Pinned `@modelcontextprotocol/sdk` to 1.32.0.
- The npm tarball ships only the bridge, README, LICENSE and `package.json`.
- `server.json` declares the remote as `streamable-http` (previously `sse`) and adds the npm stdio package.
- README rewritten with current connection instructions for each client.

### Removed
- `index.d.ts`, which declared exports the package never provided.

## [1.0.5] - 2026-09-28

### Added
- Runnable stdio launcher (`index.js`) that proxied tool calls to the remote endpoint
- `glama.json` for Glama directory ownership claim

### Fixed
- Package type compatibility: converted to proper ES module

## [1.0.0] - 2025-01-01

### Added
- Initial release
