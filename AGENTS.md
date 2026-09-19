# Contributor instructions

## Scope

This is the independent **thenewboston-Tutorials** React, TypeScript, and Vite app. It contains **Chapter 1 — Core Architecture**, twelve slides with route id `core-architecture`. Work only in this repository unless the task explicitly names another. Do not change existing `.git`, `.gitignore`, or `.idea` configuration without a relevant request.

The self-contained teaching source is [docs/core-architecture-source.md](docs/core-architecture-source.md); the visual and interaction specification is [docs/chapter-01-art-direction.md](docs/chapter-01-art-direction.md). Read the relevant parts before changing lesson behavior. Optional Core/DBDC references provide author context, not required filesystem dependencies. Do not import or load runtime code, assets, or data from sibling repositories.

## Structure

Keep chapter metadata in `src/chapters/chapter-01.ts`, use the shared `Chapter`/`Slide` types, and register chapters in numeric order. Chapter 1 is the initial and invalid-chapter fallback. Preserve stable chapter and visual ids; slide URLs use 1-based positions. The twelve visual ids, in order, are:

1. `architecture-core-server`
2. `architecture-core-mint`
3. `architecture-core-connect`
4. `architecture-core-transfer`
5. `architecture-request-types`
6. `architecture-messaging`
7. `architecture-coins-data`
8. `architecture-ping-pong`
9. `architecture-bacoin-core`
10. `architecture-guessing-game`
11. `architecture-bitcoin-buy`
12. `architecture-bitcoin-sell`

Keep three or four clear presenter points per slide. `sourcePath` refers to the authored document in this repository and is author metadata, not a runtime dependency. Chapter 1 uses ordinary slide navigation and declares no manual phases. Preserve navigation controls, browser history, and keyboard access; typing in a form must not trigger slide shortcuts.

## Layout and content

Use the existing React/CSS stack without adding animation dependencies. Keep the fixed 2560 × 1440 scene and uniform scaling. Titles and narration belong in the sidebar; canvas labels explain the diagram. Preserve the dark navy/blue dimensional server, readable flat phone screens, native editable labels, and the perspective-aligned currency coin emblem. Slides 1–8 use Bonsai; slides 9–12 use Tuna, represented by a silver struck-metal coin with a colored tuna fish motif. Keep the stable id/visual `architecture-bacoin-core` unchanged despite the display-name change. Keep Tuna as the default currency/Core for subsequent new examples unless the author specifies otherwise. Any human portrait must be a generated image, never an SVG face.

Put the corresponding Bonsai Core or Tuna Core label above the server, balance tables to its right, and connected phones below. Wires curve from phone tops to Core without arrowheads or outside Connected labels. Slide 3’s green Connected status belongs inside its phone. Slides 6 and 7 center the whole composition vertically, with balanced space above the Core label and below the Bucky/Ty names; preserve scale and relative positions, wires, and packet paths. Slides 8 and 10 use the same balanced composition with Bucky’s phone and a laptop. Do not add the old standalone “100 minted” caption or adjacent coin.

Preserve these scene contracts:

- Slides 1–3 establish Core alone, then Bucky/account 123/balance 100, then the connected phone without a transfer.
- Slide 4 waits with Bucky 100 and no Ty row, packet, or deltas. Read-only To Ty / Amount 1 precedes a real Send button. Only after the request reaches Core, record Bucky 99/−1 and Ty/account 456/1/+1. Allow one transfer per demonstration.
- Slide 5 orders Coins only, Data only, Coins + data, all To Ty. Use Amount 1 for coin examples and Payload “Hello, Ty” for data examples. Coins only has no payload/empty row; Data only has no amount or reserved blank slot. Stack left-aligned labels above values. Use Bonsai Coins and no envelope.
- Slide 6 has read-only To fields above Message: Bucky→Ty and Ty→Bucky. Keep names beneath phones, no screen-name headers, no Amount or balance table. Bucky starts “Hello, Ty”; Ty starts empty. Send clears the sender’s field immediately. Show incoming bubbles only after arrival. Two seconds after Ty receives the message, type “Hey Dad” at roughly 160 ms per character. Keep Ty’s Send disabled until complete, then wait for a manual click. End with two incoming bubbles and two empty fields. Nothing auto-sends or repopulates Bucky.
- Slide 7 continues at Bucky 99 / Ty 1. Fix recipient Ty; allow editing amount 1–99 in whole coins and message “Here you go” before Send. At Core arrival, record 99−amount / 1+amount; only at Ty’s phone arrival show the message and Bonsai +amount receipt. Default result is 98/2 with +1. The receipt is the transfer amount, not Ty’s balance. Permit one transfer and no reply.
- Slide 8 places Core top center, Bucky’s phone bottom left, and a laptop Ping-pong app bottom right. No JSON, accounts, amounts, balance table, or Ty. Start idle at 0.00 s. Clicking Send Ping starts the phone timer and Ping phone→Core→laptop; laptop receipt immediately starts automatic Pong laptop→Core→phone. Stop timing only at Pong’s phone arrival. Each of four normal-motion legs lasts roughly 1400 ms. Allow one click-initiated round trip. The timer is illustrative presentation time, not a network benchmark or actual request; explain this only in notes/docs.
- Slide 9 matches slide 1’s standalone server layout, labeled Tuna Core with the silver struck-metal Tuna coin/emblem and colored tuna fish motif. Keep the spelling Tuna and show no other devices or table.
- Slide 10 uses Tuna Core top center, Bucky phone left, laptop Guessing game right, and the balance table to Core’s right. Start Bucky (123) at 100 and App (789) at 100. Use fixed amount 1 and an editable integer guess 1–10, default 1; the idle laptop shows Pick a number, the range 1–10, and a 10-Tuna prize. The illustrative winning number is always 5, explained only in notes. Send follows four legs of roughly 1400 ms: first Core arrival saves 99/101; laptop receipt decides the result and replies; reply-Core arrival saves 109/91 for You win +10 or keeps 99/101 for You lose with data only and amount 0; phone arrival reveals the result and +10 coin only on a win. No early result, losing coin indicator, or automatic restart. One play per Replay; fees are omitted only for teaching.

- Slides 11–12 use Tuna Core top center, phone left, Trading app laptop right, and a Bitcoin node lower-center. Both devices connect to both networks: Tuna blue, Bitcoin orange. Wallets authorize spending; the Bitcoin node validates/relays and supplies no payout funds. Use fixed teaching rate 100 Tuna = 1 BTC, with fees, unusable shortened addresses, simulated confirmation, and no-real-network context in notes/docs only. Do not promise a real confirmation count or duration.
- Slide 11 starts Tuna 100/100 and BTC 0/1. Read-only To Trading app, Amount100, receiving address bc1q…bucky; Buy 1 BTC starts payment phone→Core→app. Save Tuna 0/200 at Core before laptop receipt. Then the app’s wallet sends 1 BTC via the node/network; confirmation settles BTC ownership to 1/0. At bitcoin-to-phone the app displays 0 BTC, while Bucky’s display stays 0 until complete; then it becomes 1 and shows +1 BTC. One buy per reset.
- Slide 12 initializes independently at Tuna 0/200 and BTC 1/0. Request deposit address sends 1-BTC request data through Core without moving Tuna. The app starts monitoring when returning bc1q…trade; wait for address arrival before enabling the separate Send 1 BTC button. On that click, Bucky’s wallet funds the address through Bitcoin. Confirmation settles BTC ownership to 0/1. At deposit-to-app Bucky displays 0 BTC, while the app still displays 0. At payout-to-core the confirmed deposit information reaches the app and its display becomes 1 BTC. Only then send 100 Tuna app→Core→phone; Core saves 100/100 before phone +100. One sell per reset, preserving both manual clicks.

Fees stay in notes/docs, not canvas arithmetic. Real Core requests include a configured fee, including data-only requests. Accounts 123/456/789 are shortened teaching labels. Administrative starting balances do not mean ordinary wallets can mint. Core records precede app delivery; app receipt does not create the account credit.

## Motion and verification

Never advance slides on a timer. Interactive slides wait for their action button in normal and reduced motion. Pause must hold travel, reply delay, and partial typing. Reduced motion removes travel but preserves slide 6’s two-second delay and typing cadence. Replay, reentry, and refresh cancel pending work and restore defaults: slide 4 Bucky 100; slide 6 initial fields; slide 7 balances 99/1, amount 1, and “Here you go”; slide 8 idle timer 0.00 s; slide 10 balances 100/100 and guess 1. For slide 8, pause holds travel and the elapsed timer; reduced motion completes immediately after the click with 0.00 s. Reset must cancel slide 8’s automatic reply and timer work. Slide 10 pause holds its four request legs; reduced motion completes the chosen outcome immediately after Send while preserving accounting order. Reset cancels its pending response and outcome work. Slides 11–12 use 1400 ms travel legs and a 1200 ms simulated confirmation beat; pause holds both. Resets cancel all work and restore their independent starting states. Reduced motion or a preference change settles only the active automatic segment: buy to complete, sell address exchange to awaiting-bitcoin, or sell funding to complete. Never bypass the seller’s second click. Repeated activation must not double-apply a transfer.

Use `npm ci` to install. Development uses Vite’s default 5173; browser tests and explicit preview use 4174. Run checks appropriate to changes: `npm run lint`, `npm run typecheck`, `npm run build`, `npm test`, and `npm run format:check`. For visual/interaction changes, inspect desktop and 390 × 844 mobile in normal/reduced motion, verify canvas bounds and text fit, and exercise keyboard Send, pause/resume, replay, route changes, and delayed-work cancellation. Avoid tests that merely repeat static metadata. Do not stage or commit unless requested.
