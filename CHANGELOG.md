# Changelog

All notable changes to the `maqami-travel` npm package, registry metadata and documentation.

## [Unreleased]

### Added
- Documentation only: quick start table, agent booking flow and FAQ in the README, `AGENTS.md`, `llms.txt`, `SECURITY.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, issue forms and `CITATION.cff`. No changes to `index.js` or the hosted server.

- Plugin packaging only: `.claude-plugin/marketplace.json` (Claude Code marketplace `maqami`), `.codex-plugin/plugin.json` with `assets/logo-512.png` (Codex plugin), and the `maqami-travel-booking` skill in `skills/`. No changes to `index.js` or the hosted server.

### Changed
- `maqami-travel-booking` skill: new "Untrusted content" and "Payments" sections, and the confirm-before-booking rules now also cover amend, cancel and extra-charge tools. Documentation only.
- `maqami-travel-booking` skill: Payments section corrected against the live `tools/list` schemas. No tool returns a payment page or checkout link, so the agent pays only through the client's own secure Stripe form or stops after prebook and points the user to book.maqami.co. `ACC_CREDIT_CARD`, `CREDIT` and `WALLET` bill the server's account and are not to be used; `CREDIT_CARD`/`billingInfo` is not for chat; `THIRD_PARTY` documented. Documentation only.
- `maqami-travel-booking` skill: Payments section updated for the Stripe-only server. `TRANSACTION_ID` (hotels may also send `TRANSACTION`) with the `transactionId` from a prebook is the only payment method, and `usePaymentSdk` is always on; the server now rejects every other method. Documentation only.
- `maqami-travel-booking` skill: Payments section updated for the server's current payment rules. Available methods are `TRANSACTION_ID` (Stripe; `TRANSACTION` for hotels), `CREDIT_CARD` (card details in `billingInfo`, sent through the server's tokenizing card endpoint) and `THIRD_PARTY` (flights, gateway token); `usePaymentSdk` is optional again; `WALLET`, `ACC_CREDIT_CARD` and `CREDIT` are rejected. Stripe (`TRANSACTION_ID`) is the method to use while the supplier answers "payment method unsupported" for `CREDIT_CARD`. The hotel flow now asks for confirmation before `post_rates_prebook`. `GEMINI.md` gains the untrusted-content and no-card-numbers-in-chat rules. Documentation only.
- `maqami-travel-booking` skill and `GEMINI.md`: hotel prebooks now return a `checkoutUrl` (book.maqami.co checkout for that hold); the hotel payment step tells the agent to give it to the customer to enter guest details and pay. Documentation only.

- Skill, `AGENTS.md`, `GEMINI.md`, `llms.txt` and README: documented flow matches the hardened server. There is no places-search step (search rates by `cityName` with `countryCode`, coordinates, `iataCode`, `hotelIds` or `aiSearch`); hotel `offerId`s are signed and must be passed exactly as returned; rebooking, tour booking, hotel add-ons, places and price-index tools are not available; only the tools in `tools/list` exist. Documentation only.

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
