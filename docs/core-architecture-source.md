# Core Architecture — authored tutorial request

This document records the author’s requested introduction to a new architecture tutorial series. It is presented as **Chapter 1 — Core Architecture** in this independent tutorial app. The introduction contains fifteen actual slides, each with its own URL position. Slides 1–4 establish the server and transfer, slide 5 compares request types, slide 6 demonstrates messaging, slide 7 combines coins with an editable message, slide 8 follows a Ping/Pong round trip, slides 9–10 introduce Tuna Core and a guessing game, slides 11–12 buy and sell Bitcoin through a trading app, slide 13 introduces Coffee Core alone, slide 14 exchanges Bonsai and Coffee through their respective Core servers, and slide 15 introduces Bridge between one client and three currency Cores. There are no phase controls.

## Slide 1: Core server

Show a Core server labeled **Bonsai Core** by itself. No phone, balance table, or transfer is visible yet.

## Slide 2: mint 100

Add the server’s balance table with Bucky’s account **123** holding **100** coins. Bucky is the only account shown. This establishes the starting coins before connecting a phone.

## Slide 3: connect phone

Connect Bucky’s phone to Core while keeping Bucky’s balance at **100**. The phone shows a green checkmark and green **Connected** text inside its screen, replacing the coin formerly shown there.

## Slide 4: transfer one coin

Begin waiting with only Bucky’s **100** in the table: no packet, balance deltas, or Ty row. The phone’s read-only form shows **To / Ty** and **Amount / 1**. Pressing its real, keyboard-accessible **Send** button starts one finite block/request animation to Core. Only after arrival, show **Bucky 99 / −1** and add **Ty 1 / +1** at account **456**.

Repeated Send activations during or after completion must not charge the example twice. Replay, leaving and reentering the slide, or reload restores the fresh waiting state with Bucky at 100. Reduced motion still waits for Send, then reveals the result without traveling animation. Preserve the requested arithmetic exactly.

## Slide 5: request types

Show a static three-way comparison in this order, with **To / Ty** on every card:

- **Coins only:** show **Amount / 1**; omit the former Data/Empty row.
- **Data only:** show **Payload / Hello, Ty**, with no amount displayed.
- **Coins + data:** show **Amount / 1** and **Payload / Hello, Ty**.

Place each To, Amount, and Payload label above its value and align all fields consistently to the left. On Data only, Payload follows To directly, without a blank Amount slot. Use three equally weighted cards with generous Bonsai Coin symbols, clear fields, and no envelope illustration. Keep the exact cases and message above. These are three uses of one request format. Slide 7 provides the interactive coins-with-data example.

## Slide 6: messaging app

Show Core at the top center, Bucky’s phone at the bottom left, and Ty’s phone at the bottom right, without an account table. Keep contact-name headers off the phone screens; retain the **Bucky** and **Ty** labels beneath the phones. Above Message, add a read-only **To** input in the same style as slide 7: **Ty** on Bucky’s phone and **Bucky** on Ty’s phone. These recipient fields are allowed; do not add an Amount field. Bucky’s text area initially contains **Hello, Ty**; Ty’s text area is empty.

Pressing Send clears that sender’s text area immediately. Bucky’s request travels **Bucky → Core → Ty**, and the received bubble appears only after arrival. Exactly **two seconds after Ty receives the message**, begin typing **Hey Dad** into Ty’s text area, one character at a time at approximately **160 ms per character**. Keep Ty’s Send button disabled during partial typing. Once the complete reply is visible, Ty must wait for the user to click Send; typing never sends the reply. That click clears Ty’s field immediately and sends his reply **Ty → Core → Bucky**, with Bucky’s received bubble appearing only on arrival. Preserve both message strings exactly, without final periods.

After both deliveries, leave two received bubbles and two empty text areas. Do not refill Bucky’s field or allow another send from an empty field; nothing sends automatically. Replay, leaving and reentering the slide, or reload starts a fresh round, cancels any pending reply delay or typing, and restores the initial text areas. Pause must hold the delay, partial typing, and request travel. Reduced motion makes request travel immediate but preserves the two-second reply delay and character-by-character timing.

## Slide 7: a coin and a message

Continue the earlier transfer’s balances, with Bucky’s account **123 / 99** and Ty’s account **456 / 1** recorded at Core. Bucky’s phone has fixed recipient **Ty**, an editable amount initially **1**, and an editable message initially **Here you go**, without a final period. Before Send, allow a positive whole amount from **1 through 99** and a changed message. Slide 6’s conversation and reply behavior remain unchanged.

Pressing Send carries the chosen amount and message together **Bucky → Core → Ty**. When the request reaches Core, record **Bucky = 99 − amount** and **Ty = 1 + amount**. With the default amount, these become **98 / 2**. Only when the incoming result reaches Ty’s phone, reveal the submitted message and a Bonsai Coin receipt indicator **+amount**: by default **Here you go** and **+1**. The receipt shows this transfer’s amount, not Ty’s new total balance.

This is one transfer per demonstration, with no automatic reply. Repeated Send cannot apply it again. Replay, leaving and reentering the slide, or reload cancels pending work and restores balances **99 / 1**, amount **1**, and message **Here you go**. Pause holds travel; reduced motion preserves the same button-driven sequence without travel animation. Fees remain omitted from the canvas and arithmetic, as explained in presenter notes.

## Slide 8: Ping. Pong.

Show Bonsai Core at the top center, Bucky’s phone at the bottom left, and a laptop running a **Ping-pong app** at the bottom right. Balance the complete composition vertically as on slides 6 and 7. Keep this view focused on Ping, Pong, and the phone timer: no JSON, accounts, amounts, balance table, or Ty.

Initially the phone timer reads **0.00 s** and nothing travels. Clicking the keyboard-accessible **Send Ping** button starts the timer and sends **Ping** along **phone → Core → laptop**. Immediately when the laptop receives Ping, the app automatically sends **Pong** along **laptop → Core → phone**. Stop the phone’s timer only when Pong arrives back at the phone, not at Core or the laptop. Each of the four travel legs takes approximately **1400 ms** in normal motion.

Allow one click-initiated round trip per demonstration. Pause holds both travel and the phone timer. Replay, leaving and reentering the slide, or reload cancels the in-flight request, automatic reply, and timer work, then restores the idle **0.00 s** state. With reduced motion, still wait for Send Ping, then complete the round trip immediately with the timer at **0.00 s**.

The timer shows elapsed presentation time in a local illustration, not a network benchmark or an actual network request. Keep that explanation in presenter notes and documentation, off the canvas.

## Slide 9: Tuna Core

Show **Tuna Core** alone in the same standalone server composition as slide 1, with a silver struck-metal Tuna coin/emblem bearing a colored tuna fish motif in place of the Bonsai emblem. Preserve the exact spelling **Tuna**. There are no phones, laptop, account table, requests, or game controls on this slide.

Tuna is the currency and Core server for subsequent new examples unless the author specifies another currency. Slides 1–8 remain Bonsai examples.

## Slide 10: guess a number

Use slide 8’s layout with **Tuna Core** at the top center, Bucky’s phone at the bottom left, and a laptop **Guessing game** at the bottom right. Add the balance table to Core’s right, initially **123 / Bucky / 100** and **789 / App / 100**. These account numbers are simplified teaching labels. The phone sends a fixed **Amount / 1** with an editable integer guess from **1 through 10**, initially **1**. The idle laptop displays **Pick a number**, the range **1–10**, and a **10 Tuna** prize.

One click on Send begins **phone → Core → laptop → Core → phone**, with each of the four travel legs lasting approximately **1400 ms** in normal motion. At the first Core arrival, record **Bucky 99 / App 101**. The laptop evaluates the guess only when it receives the request, then responds automatically:

- Guess **5** produces **You win** with **10** Tuna. At the reply’s Core arrival, record **Bucky 109 / App 91**. At the phone arrival, show **You win** and a Tuna **+10** receipt.
- Every other valid guess produces **You lose** with zero coin amount, a data-only reply. The reply leaves balances at **Bucky 99 / App 101**. At the phone arrival, show **You lose** without a coin indicator.

Do not determine or display the result before the laptop receives the guess, and do not show the phone’s result or receipt before the reply reaches it. The winning payout comes from the App’s recorded balance. The initial request and the reply are separate transfers through Core.

The winning number is always **5** for this deterministic illustration. Explain that fixed answer and the omitted transaction fees only in presenter notes/documentation; do not announce the fixed answer on the idle canvas. Allow one round per demonstration. Replay, leaving and reentering the slide, or reload cancels pending work and restores **100 / 100**, guess **1**, and the idle app. Pause holds request travel. Reduced motion still waits for Send, then completes the same chosen outcome without animated travel.

## Slide 11: buy Bitcoin

Use **Tuna Core** at the top center, Bucky’s phone at the bottom left, a laptop **Trading app** at the bottom right, and a **Bitcoin node** centered below Core between the devices. Both devices connect to both networks: blue connections for Tuna Core and orange for Bitcoin. Preserve **Tuna** spelling. Bitcoin ownership and Tuna account records remain separate. Each device’s BTC label shows only the wallet balance that device has learned; confirmation can precede the other device’s notification.

Begin with Tuna **Bucky 100 / App 100** and Bitcoin **Bucky 0 / App 1 BTC**. The phone shows read-only **To / Trading app**, **Amount / 100**, and **Bitcoin receiving address / bc1q…bucky**, with a clickable **Buy 1 BTC** button. The fixed teaching rate is **100 Tuna = 1 BTC**.

A click sends Bucky’s Tuna payment and receiving address through Core. On reaching Core, record Tuna **0 / 200** before the request reaches the laptop. After the app receives the request, its wallet authorizes a **1 BTC** transaction to Bucky’s address through the Bitcoin node/network. Show a simulated confirmation before confirmed Bitcoin ownership becomes **1 / 0**. At that point the app displays **0 BTC**, while Bucky’s phone still displays **0 BTC** until it receives the result. At phone arrival, update Bucky’s display to **1 BTC** and reveal **+1 BTC**.

The internal animation states are: **ready → payment-to-core → payment-to-app → bitcoin-to-node → confirming → bitcoin-to-phone → complete**. Tuna becomes **0 / 200** on entering payment-to-app. Confirmed Bitcoin ownership becomes **1 / 0** on entering bitcoin-to-phone: the app displays 0, but Bucky’s display stays 0 until complete. Each travel leg lasts **1400 ms**, and confirming lasts **1200 ms**, as presentation timing only. These are automatic states after the click, not manual phase controls.

## Slide 12: sell Bitcoin

Use the same two-network layout. Independently initialize the outcome of the buying example: Tuna **Bucky 0 / App 200**, Bitcoin **Bucky 1 / App 0 BTC**. This slide does not depend on having completed slide 11.

First click **Request deposit address**. A payload requesting a deposit address for **1 BTC** travels through Core to the trading app, with no Tuna transfer in this simplified example. The app returns **bc1q…trade** through Core and begins monitoring for payment to that address. Only after the address reaches the phone, enable a separate manual **Send 1 BTC** action.

That second click authorizes Bucky’s Bitcoin wallet to send **1 BTC** through the Bitcoin node/network. After simulated confirmation, confirmed Bitcoin ownership is **Bucky 0 / App 1**. Bucky’s display becomes **0 BTC**, but the app still displays **0 BTC** while the confirmed payment information travels to it. On app receipt, its display becomes **1 BTC**. Only after the app receives that confirmed deposit does it send **100 Tuna** through Core. Core records Tuna **100 / 100** before the phone receives its final **+100 Tuna**.

The address segment is **ready → address-request-to-core → address-request-to-app → address-to-core → address-to-phone → awaiting-bitcoin**. Monitoring begins on entering address-to-core. The funding segment begins only after the second click: **deposit-to-node → confirming → deposit-to-app → payout-to-core → payout-to-phone → complete**. Confirmed Bitcoin ownership becomes **0 / 1** on entering deposit-to-app: Bucky displays 0, while the app still displays 0. On entering payout-to-core, the app receives the confirmed deposit and displays 1; Core records **100 / 100** on entering payout-to-phone. Travel legs last **1400 ms** and confirmation **1200 ms**, as presentation timing only.

Each slide permits one cycle. Pause holds travel and confirmation. Replay, reentry, and reload cancel pending work and restore that slide’s initial balances and controls. Reduced motion still waits for the initial click and completes only the current automatic segment: the entire buy, the sell address request up to awaiting-bitcoin, or the sell funding segment. Changing the motion preference during an active segment settles only that segment; it must never bypass the seller’s second manual click.

The exchange rate is an illustrative constant, not a market quote. **bc1q…bucky** and **bc1q…trade** are shortened placeholders, not usable addresses. No real network request or transaction occurs, fees are omitted, and the confirmation beat promises no real duration or number of confirmations. Explain these points only in presenter notes/documentation. The wallet authorizes spending; the Bitcoin node validates and relays transactions rather than supplying the payout funds. See the [Bitcoin role and confirmation references](chapter-01-art-direction.md#bitcoin-roles-and-confirmation) used to verify these distinctions.

## Slide 13: Coffee Core

Show **Coffee Core** alone in the same standalone server composition as slides 1 and 9, with its Coffee coin emblem. The Coffee coin’s metal is **bronze** throughout, including the server emblem and the following exchange’s coin graphics. Show no phones, table, or request on this introduction slide.

## Slide 14: exchange Bonsai for Coffee

Show Bucky’s and Carla’s phones with **Bonsai Core** and **Coffee Core** as distinct currency services. Bucky’s fixed offer is **1 Bonsai for 20 Coffee**, addressed to Carla. Use readable fixed fields and sparse functional labels; no balance table is needed. Carla’s phone screen starts entirely blank: no labels, icons, offer details, or buttons. It remains blank through Bucky-to-Core and Core-to-Carla travel.

The demonstration has exactly two manual actions:

1. Click **Send offer** on Bucky’s phone. The offer travels **Bucky → Bonsai Core → Carla**. Sending or receiving this offer does not yet send Bucky’s one Bonsai. Only when it reaches Carla’s phone, reveal the complete offer and **Accept** / **Decline** buttons. Wait for Accept; show Decline without implementing a decline path.
2. Click Carla’s **Accept**. Her acceptance and **20 Coffee** travel together **Carla → Coffee Core → Bucky**. Only when this reaches Bucky’s phone does his app automatically send **1 Bonsai** along **Bucky → Bonsai Core → Carla**. No third click is required, and the final receipt waits for Carla’s phone arrival.

Pause holds travel. Replay, reentry, or reload cancels pending work and restores the unsent offer. Reduced motion removes travel while preserving both manual actions: Send offer stops at Carla’s decision, and Accept completes the two subsequent currency transfers in their stated order. One exchange completes the demonstration; repeated activation must not duplicate it.

This is an application-managed sequential exchange between separate currencies, not a single atomic exchange supplied by Core. The fixed offer is an illustrative agreement, not a market quote, and fees are omitted. Keep these explanations in presenter notes and documentation, with no warnings on the canvas. This author-specified Bonsai/Coffee example leaves Tuna slides 9–12 unchanged.

## Slide 15: one connection, more possibilities

Show exactly **three Core servers**, **one Bridge server**, and **Bucky’s client laptop**. Label the middle service exactly **Bridge**, not Exchange server. Bucky’s laptop connects **only to Bridge**. Bridge has separate connections to **Bonsai Core**, **Coffee Core**, and **Tuna Core**; there are no direct laptop-to-Core wires.

Preserve the established coin identities: **gold Bonsai**, **bronze Coffee**, and **silver Tuna** with its colored tuna fish motif. Add no currency or balance table. Keep the laptop screen readable, with two distinct feature examples: **Trade**, showing an illustrative fixed **1 Bonsai → 20 Coffee** exchange, and a **social post with coin-tip indicators**.

This is a static architecture overview. The examples show what the client can present through its connection to Bridge; they are not clickable demonstrations. Include no actions, request travel, timers, balances, or simulated settlement. Keep the diagram focused on the connections and the two features rather than explaining a settlement protocol.

## Presentation conventions

Use clean native architecture diagrams and generous, readable labels. Slides advance only through ordinary slide navigation, never automatically. Slides 1–3, 5, 9, 13, and 15 are static teaching states; slides 4, 6, 7, 8, 10, 11, 12, and 14 wait for their initial action button. Keep each scene focused on its specified architecture.

The optional author references [server.jpg](/Users/bucky/Downloads/server.jpg) and [server2.jpg](/Users/bucky/Downloads/server2.jpg) informed the server style. They are not app assets or build dependencies. Use original native vector art with crisp professional dimensional/isometric construction in dark navy and blue. Polish the phones to the same dimensional style, keeping the screen content flat and readable. Add the currency’s coin emblem to the server’s upper-right side panel, following that panel’s isometric perspective: Bonsai on slides 1–8, Tuna on slides 9–12, Coffee on slide 13, and the corresponding Bonsai/Coffee emblems on slide 14. Slide 15 reuses all three established currency emblems. All Coffee coin metal is bronze; Bonsai remains gold. Tuna uses a silver struck-metal coin with a colored tuna fish motif throughout, including server emblems and receipt indicators.

On slide 4, stack **To** above an input containing **Ty**, then **Amount** above an input containing **1**. Place the **Send** button at the bottom, with the Bonsai coin logo to the right of the Send text. Keep both fields read-only.

Apply the author’s visual directions throughout:

- Put the **Bonsai Core**, **Tuna Core**, or **Coffee Core** label above its corresponding server.
- Place each balance table to the right of its server.
- Remove the standalone **100 minted** caption and the coin beside that caption from every slide.
- When a phone is connected, place Core at the top center and Bucky’s phone at the bottom left. Run a gently curved wire from the top of the phone to the left side of Core, with no arrowheads or outside **Connected** labels. Slide 3’s green **Connected** status belongs inside the phone.
- On slides 6 and 7, vertically center the complete composition with balanced whitespace above the Bonsai Core label and below the Bucky/Ty names, preserving scale, relative positions, wires, and packet paths. Apply the same balanced composition to the phone and laptop on slides 8 and 10.

Fees are omitted from the displayed arithmetic and messaging demonstration; this does not make data-only requests free. **123**, **456**, and **789** are simplified teaching account labels. Brief source and implementation context belongs in presenter notes and [the art-direction document](chapter-01-art-direction.md), keeping the canvas focused on the requested flow.
