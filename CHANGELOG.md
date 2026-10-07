# Changelog

All notable changes to the `maqami-travel` npm package, registry metadata and documentation.

## [1.0.8] - 2026-10-07

### Hosted server (https://mcp.maqami.co/)
- Every booking tool now accepts and requires `email` next to `bookingId`. Five tools (`post_bookings_bookingid_alternative_prebooks`, `get_flights_bookings_bookingid_services`, `get_flights_bookings_bookingid_cancellations`, `getExperienceBooking`, `getExperienceBookingCancelPreview`) needed the email for the ownership check but did not list it in their input schema, so clients that validate arguments could not call them.
- `put_bookings_bookingid_amend` publishes its real input: `bookingId`, the `email` currently on the booking and the corrected `holder` (`firstName`, `lastName`, `email`, optional `phone`). Its description now says what it does: it corrects the holder's details and does not change dates, rooms or guests.
- The ownership check also matches the booking holder's email and last name, and the email and last name used for the check are no longer forwarded with the call.
- `listBookings` is no longer offered: it returned bookings for a guest ID or client reference without the email check. Look up a booking with `get_bookings_bookingid`, `bookingId` and `email`.
- `get_data_hotel_search` returns up to five matches (new `limit`, up to 20) instead of a single match that could be a different hotel.
- Cancel tools say to check the cancellation policy or refund estimate and confirm with the customer first.
- Server version 1.0.8; 40 tools.

### Added
- Claude Desktop extension: `mcpb/manifest.json` and `scripts/build-mcpb.sh` (`npm run build:mcpb`) build `maqami-travel.mcpb`, which wraps the 1.0.7 stdio bridge. It is attached to the latest GitHub release. README: one-click Claude Desktop install, and which ChatGPT and Claude plans can connect. No changes to `index.js` or the hosted server.
- `test/manifests.test.js` (part of `npm test`): every manifest must parse, carry the `package.json` version and point at `https://mcp.maqami.co/`.
- README: one-click install links for Cursor and VS Code.
- `server.json`: the MAQAMI logo as the registry icon (takes effect at the next registry publish).
- CI: `npm test` runs on every pull request and push to `main` (Node 22 and 24).
- Release workflow: publishing a GitHub release attaches `maqami-travel.mcpb`, publishes the npm package with provenance and publishes `server.json` to the Official MCP Registry with GitHub OIDC.

### Changed
- Skill, README, `AGENTS.md`, `GEMINI.md` and `llms.txt` now match how the live tools behave: find a hotel by name with `get_data_hotels` and `hotelName` (`get_data_hotel_search` returns semantic matches, which can include other hotels); pass `bookingId` and `email` to every booking tool; flight offers expire, so search again if verify reports one is gone; set `limit`, `maxRatesPerHotel` and flight `filters`, and avoid the whole-list reference tools unless an ID is needed. The flight flow is verify, then confirm the final price, everywhere. Documentation only.
- Claude Desktop extension description: removed the unverifiable "wholesale rates" claim.
- Version lists in `AGENTS.md` and `CONTRIBUTING.md` now name every manifest; `CITATION.cff` carries the release date.

## [1.0.7] - 2026-10-06

### Added
- Documentation only: quick start table, agent booking flow and FAQ in the README, `AGENTS.md`, `llms.txt`, `SECURITY.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, issue forms and `CITATION.cff`. No changes to `index.js` or the hosted server.

- Plugin packaging only: `.claude-plugin/marketplace.json` (Claude Code marketplace `maqami`), `.codex-plugin/plugin.json` with `assets/logo-512.png` (Codex plugin), and the `maqami-travel-booking` skill in `skills/`. No changes to `index.js` or the hosted server.

### Changed
- Website-only checkout: the skill, README, `AGENTS.md`, `llms.txt`, `GEMINI.md` and plugin descriptions now match the live server. Customers book and pay only on book.maqami.co: hotels use the `checkoutUrl` from `post_rates_prebook`, flights the `checkoutUrl` from `post_flights_verify`. In-chat booking and payment steps, removed tools and every payment-method name are gone from the docs; the hotel cancel tool is documented as `cancel_hotel_booking`. Documentation only.
- `maqami-travel-booking` skill: new "Untrusted content" section, and the confirm-before-booking rules now also cover the amend and cancel tools. Documentation only.

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
