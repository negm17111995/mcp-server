---
name: maqami-travel-booking
description: Search, compare and book hotels and flights with the MAQAMI Travel MCP server (https://mcp.maqami.co/). Use when the user asks to find hotels or flights for specific dates, compare rates, read hotel details or reviews, look up airports, or prebook and book a hotel room or flight.
---

# MAQAMI Travel booking

Use the tools of the `maqami-travel` MCP server (`https://mcp.maqami.co/`, Streamable HTTP, no API key). Clients usually prefix the tool names with the server name, for example `mcp__maqami-travel__post_hotels_rates`; the steps below use the bare names. The tool list the server returns is always the source of truth for names and input schemas.

Search and details tools are read-only. Prebook and book are not: booking creates a real reservation with the guest's personal and payment details.

## Collect the trip details first

Ask one short follow-up for anything that is missing instead of guessing.

- **Hotels:** destination, check-in and check-out dates, number of rooms and guests per room (adults, and children with ages), the lead guest's nationality and the currency.
- **Flights:** origin and destination (city or airport), departure date, return date for a round trip, number of passengers and the currency.

Resolve unambiguous relative dates ("next Friday") from today's date. Never invent dates, passenger counts or nationality.

## Hotel flow

1. **Find the destination.** Resolve a city, area or landmark with `get_data_places`, or find hotels by name with `get_data_hotels` or `get_data_hotel_search`.
2. **Search rates.** Call `post_hotels_rates` with `checkin`, `checkout`, `occupancies`, `currency`, `guestNationality` and one location field (`placeId`, `cityName` with `countryCode`, `hotelIds`, coordinates, `iataCode` or `aiSearch`). Each rate carries an `offerId`.
3. **Show a short comparison**: hotel name, room, board, total price with currency and the cancellation terms when they are returned.
4. **Details on request.** Use `get_data_hotel` for description, amenities and photos, and `get_data_reviews` for guest reviews.
5. **Prebook** the chosen `offerId` with `post_rates_prebook`. It returns a `prebookId`, the final price and the cancellation terms.
6. **Confirm with the user.** Show the hotel, room, dates, guests, final price and cancellation terms, and wait for a clear yes.
7. **Book** with `post_rates_book`, using the `prebookId` and the holder, guest and payment details the user provided.

## Flight flow

1. **Find airports** with `get_data_flights_airports` when the user gives a city.
2. **Search** with `post_flights_rates`: `legs` (each with `origin`, `destination` and `date`; one leg for one-way, two for a round trip), `adults` and `currency`.
3. **Verify** the chosen `offerId` with `post_flights_verify` to get the latest price, baggage and fare rules.
4. **Confirm with the user.** Show the flights, passengers, final price and fare rules, and wait for a clear yes.
5. **Prebook** with `post_flights_prebooks` (contact and passenger details), which returns a `prebookId`.
6. **Book** with `post_flights_bookings`, using the `prebookId` and the payment details.

## Rules for every booking

- Quote only what the tools return. Keep the currency exactly as returned and do not claim a result is the cheapest available anywhere.
- If prebook or verify returns a different price or says the offer is gone, show the new result and ask again.
- Ask for guest and payment details only after the user has chosen an option, and send only the fields the booking needs.
- Do not call tools that list, change or cancel existing bookings, vouchers or account data unless the user explicitly asks for that.
- After booking, report the confirmation details the tool returns. If the call fails, say so plainly and do not retry a booking without asking.
