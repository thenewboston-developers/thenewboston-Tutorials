# Chapter 1 — Core Architecture

Source: [the authored architecture request](core-architecture-source.md). This begins an independent architecture tutorial series. Chapter 1 contains ten actual URL slides: the server and transfer in slides 1–4, request types in slide 5, messaging in slide 6, an editable coins-with-data example in slide 7, a Ping/Pong round trip in slide 8, and Bacoin Core with a guessing game in slides 9–10. Keep ordinary slide navigation, with no phase controls.

## Ten-slide outline

| Slide | Visual id                    | Presenter title              | Main idea                                                                                  |
| ----- | ---------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------ |
| 1     | `architecture-core-server`   | Bonsai Core.                 | Introduce the server alone.                                                                |
| 2     | `architecture-core-mint`     | Mint 100.                    | Establish Bucky’s account 123 with 100 coins.                                              |
| 3     | `architecture-core-connect`  | Connect Bucky’s phone.       | Show the phone connected while its Core record stays at 100.                               |
| 4     | `architecture-core-transfer` | Send one coin to Ty.         | Press Send; the request reaches Core before Bucky becomes 99 and Ty becomes 1.             |
| 5     | `architecture-request-types` | Three ways to use a request. | Compare coins only, data only, then coins with data, all addressed to Ty.                  |
| 6     | `architecture-messaging`     | A conversation through Core. | Bucky sends through Core; Ty’s reply begins typing after two seconds, then waits for Send. |
| 7     | `architecture-coins-data`    | A coin and a message.        | Edit an amount and message; Core records the payment before Ty receives both.              |
| 8     | `architecture-ping-pong`     | Ping. Pong.                  | Start the phone timer; the laptop replies automatically, and Pong’s return stops it.       |
| 9     | `architecture-bacoin-core`   | Bacoin Core.                 | Introduce the next currency’s server alone, with its Bacoin emblem.                        |
| 10    | `architecture-guessing-game` | Guess a number.              | Send a one-coin guess; the app returns either a ten-coin prize or a data-only loss.        |

## Visual language and layout

Use large, editable native graphics: a server labeled **Bonsai Core** on slides 1–8 or **Bacoin Core** on slides 9–10, its balance table, connected phones, coin symbols, requests, and messages. No generated artwork is needed, so the metadata has no artwork briefs. Any reused human portrait must remain an established generated image, never an SVG face.

The server style follows the user’s optional [first reference](/Users/bucky/Downloads/server.jpg) and [second reference](/Users/bucky/Downloads/server2.jpg), neither of which is an app asset or build dependency: crisp dimensional/isometric construction, dark navy and blue faces, clearly defined rack details, and restrained indicator lights. Build original native vector artwork with these qualities. Give the phones a coherent dimensional finish while keeping their screens flat and readable. Place the corresponding Bonsai or Bacoin coin emblem on the server’s upper-right side panel, aligned with its isometric perspective.

Place each **Bonsai Core** or **Bacoin Core** label above its corresponding server. Balance tables sit to the right of their server. Show the starting 100 through the balance table; remove the standalone **100 minted** caption and its adjacent coin from every slide.

Whenever a phone is connected, position Core at the top center and Bucky’s phone at the bottom left. Connect the top of Bucky’s phone to the left side of Core with a gently curved wire. Connection wires have no arrowheads or outside **Connected** labels. Slide 3 instead places a green checkmark and green **Connected** text inside the phone, replacing its coin. Align traveling request graphics with this geometry. On slides 6 and 7, Ty’s phone sits at the bottom right. Vertically center each whole composition so the whitespace above the Bonsai Core label balances the whitespace below the Bucky/Ty names, preserving scale and all relative positions, wires, and packet paths.

Keep the existing 2560 × 1440 design space and uniform 16:9 scaling. Place titles and narration in the presenter sidebar. Canvas text consists of functional labels and exact messages, with ample space around the server, table, phones, and paths. Keep fee arithmetic and implementation checklists off the canvas.

## Slides 1–3: establish the system

Slide 1 shows only Bonsai Core, without a phone, balance table, or transfer. Slide 2 adds only **123 / Bucky / 100** to the server’s table. Slide 3 introduces Bucky’s connected phone and its green screen status while preserving that single balance row. These are distinct static slides, not phases that advance or automatically send a request.

## Slide 4: Send triggers the transfer

In Bucky’s transfer form, stack **To** above an input showing **Ty**, then **Amount** above an input showing **1**. Place a **Send** button at the bottom, with the Bonsai coin logo to the right of the Send text. Keep the fields read-only and the button keyboard accessible.

On entry, wait with only **123 / Bucky / 100** in the table: no packet, no deltas, and no Ty row. Send starts one finite block/request animation to Core. The request must arrive before the table becomes **123 / Bucky / 99 / −1** and adds **456 / Ty / 1 / +1**. Repeated activations during or after completion cannot apply another deduction.

Replay, leaving and reentering the slide, or reload restores the fresh waiting state with Bucky at 100. Reduced motion still waits for Send, then shows the recorded result without a traveling animation. This interaction never advances to another slide.

## Slide 5: three uses of one format

Order the cards **Coins only**, **Data only**, then **Coins + data**, with **To / Ty** on all three. Coins only shows **Amount / 1** and no Data/Empty row. Data only shows **Payload / Hello, Ty** and no amount. Coins + data shows **Amount / 1** and **Payload / Hello, Ty**. Use **Payload**, not Data, for both message-field labels. Stack every To, Amount, and Payload label above its value, with consistent left alignment. In Data only, place Payload directly after To; do not reserve blank space for an Amount field. Use three equally weighted cards with generous symbols and clear amount/payload areas. Use Bonsai Coins and no envelope illustration. Preserve these exact examples and keep fee labels off the canvas. Preserve the message’s spelling, comma, and capitalization; do not add a period. This comparison is static. These are three uses of the same block format, not different Core endpoint types.

## Slide 6: messaging in both directions

Keep Core top center, Bucky’s phone bottom left, and Ty’s phone bottom right. There is no account table or coin amount in this view. Keep contact-name headers off the phone screens while retaining **Bucky** and **Ty** beneath their respective phones. Add a slide-7-style read-only **To** input above **Message** on each phone: **Ty** on Bucky’s phone and **Bucky** on Ty’s phone. These recipient fields do not restore the removed headers; no Amount field appears on slide 6. Bucky’s text area begins with **Hello, Ty** and Ty’s begins empty. Both message strings, including Ty’s later **Hey Dad**, remain exact and have no final period.

Send clears its sender’s text area immediately. Bucky’s request follows **Bucky → Core → Ty**; the received bubble appears only on arrival. Start the reply delay from that delivery event, not from Bucky’s click or the request reaching Core. Exactly two seconds after Ty receives the message, begin a typewriter reveal of **Hey Dad** in his text area at approximately **160 ms per character**. This prepares the reply without sending it. Disable Ty’s Send button while the text is incomplete. Once typing finishes, wait for the user’s Send click, which immediately clears his field and starts **Ty → Core → Bucky**. Show Bucky’s received bubble only when the reply arrives. Neither reply preparation nor any other action sends automatically.

The completed round contains two received bubbles and two empty text areas. Do not repopulate Bucky’s field or allow another send from either empty field. Replay begins a fresh round. Pause holds request travel, the remaining reply delay, and partial typing. Reduced motion removes travel but preserves the two-second delay and the character-by-character reply timing. Replay, leaving and reentering the slide, or reload cancels all pending delivery, delay, and typing work, clears the conversation, and restores Bucky’s initial message and Ty’s empty field. Nothing advances to another slide automatically. Keep text readable on the flat screens and Send keyboard accessible; explain omitted fees only in narration or documentation.

## Slide 7: editable coins and data

Use the same Core-and-two-phones composition, with the balance table to Core’s right. Continue the earlier transfer’s balances: **123 / Bucky / 99** and **456 / Ty / 1**. Bucky’s recipient is fixed at **Ty**. His amount starts at **1** and his message at **Here you go**, without punctuation. Both amount and message are editable before Send; permit only positive whole amounts from **1 through 99**. Keep the existing slide 6 unchanged.

One Send carries both chosen values **Bucky → Core → Ty**. At Core arrival, update the records to **Bucky = 99 − amount** and **Ty = 1 + amount**, with matching deltas. With the default amount, show **Bucky 98 / −1** and **Ty 2 / +1**. Continue to Ty’s phone, then reveal the submitted message with a Bonsai Coin receipt indicator **+amount**. The default receipt is **Here you go** with **+1**. This indicator shows the received transfer amount, not Ty’s new total of 2. Neither the message nor receipt indicator appears before phone arrival. Phone delivery reports the already recorded payment; it does not create the credit.

Allow one transfer per demonstration and no automatic reply. Guard repeated activation from applying a second transfer. Replay, leaving and reentering the slide, or reload cancels pending work and restores **99 / 1**, amount **1**, and message **Here you go**. Pause holds the request’s progress; reduced motion still waits for Send and shows the same logical outcomes without travel animation. Keep Send keyboard accessible and keep fees out of the canvas.

## Slide 8: Ping/Pong round trip

Use Bonsai Core at the top center, Bucky’s phone at the bottom left, and a laptop running a **Ping-pong app** at the bottom right. Match the server and device finish, curved connections, and balanced vertical composition of slides 6 and 7. Preserve readable native Ping/Pong labels and a prominent phone timer. Do not add JSON, account fields, an amount, a balance table, or Ty.

Begin idle with the phone timer at **0.00 s** and an enabled, keyboard-accessible **Send Ping** button. Nothing sends or starts timing on entry. On click, start the timer and carry **Ping** through **phone → Core → laptop**. At laptop receipt, automatically start **Pong** through **laptop → Core → phone**, without another click or a reply delay. The timer continues through all four legs and stops only when Pong reaches the phone. Give each leg approximately **1400 ms** of normal-motion travel.

Allow one round trip per demonstration. Pause must hold the moving request and elapsed timer together. Replay, reentry, or reload cancels all pending travel, reply, and timer work and resets to the idle **0.00 s** state. Reduced motion still waits for Send Ping, then displays the completed round trip immediately with **0.00 s** and no travel animation. The automatic laptop reply belongs only to this request/response demonstration; it does not change slide 6’s manual reply.

The timer represents illustrative elapsed presentation time; no network request or benchmark runs. Keep that explanation in notes/documentation, not in an on-canvas disclaimer.

## Slide 9: Bacoin Core alone

Use the same scale, placement, and standalone server composition as slide 1. Change the label to **Bacoin Core** and use the Bacoin coin/emblem. Spell it **Bacoin** throughout. No phone, laptop, table, request, or game UI appears here. Bacoin is the default currency/Core for subsequent new examples unless the author specifies otherwise; leave the first eight slides on Bonsai.

## Slide 10: paid guess and app response

Follow slide 8’s balanced composition: **Bacoin Core** top center, Bucky’s phone bottom left, and a laptop labeled **Guessing game** bottom right. Place the balance table to Core’s right, with **123 / Bucky / 100** and **789 / App / 100**. Use the same dimensional device finish, readable flat screens, curved wires, and aligned packet paths. The phone has fixed **Amount / 1**, an editable integer guess from **1–10**, default **1**, and a keyboard-accessible **Send** button. The idle laptop says **Pick a number**, shows the range **1–10**, and displays a **10 Bacoin** prize.

Start with no request or result. Send carries one Bacoin plus the submitted guess through **phone → Core → laptop**. At the first Core arrival, save **Bucky 99 / App 101**. The result cannot be chosen or shown before the request reaches the laptop. At laptop receipt, immediately generate the app’s reply:

| Submitted guess | Reply                      | Records when reply reaches Core   | Phone display after reply arrives |
| --------------- | -------------------------- | --------------------------------- | --------------------------------- |
| 5               | **You win**, amount **10** | **Bucky 109 / App 91**            | **You win** and Bacoin **+10**    |
| 1–4 or 6–10     | **You lose**, amount **0** | **Bucky 99 / App 101**, unchanged | **You lose**, no coin indicator   |

The reply follows **laptop → Core → phone**. Keep each of the four normal-motion legs approximately **1400 ms**. The phone’s result and receipt wait for its arrival, even though any returned coins are already recorded at Core. The App pays the ten-coin winning reply from its balance. The losing reply carries data only and does not credit Bucky.

Use a fixed winning number of **5** to make both demonstrations reproducible. Keep that rule, the fact this is a local illustration, and omitted fees in presenter notes/documentation only; the idle canvas must not disclose the fixed answer. Permit one round per demonstration, with no automatic restart. Replay, reentry, and reload cancel outstanding work and restore **Bucky 100 / App 100**, guess **1**, and the idle laptop. Pause holds request travel. Reduced motion waits for Send and then shows the same selected outcome immediately, without changing its accounting or result.

## Source distinctions kept outside the canvas

The requested arithmetic deliberately omits transaction fees: **100 − 1 = 99**, with Ty receiving **1**. Preserve those figures for slide 4. Slide 7 continues from **99 / 1** and defaults to **98 / 2**. With an edited amount, its records become **99 − amount** and **1 + amount**; the receipt remains **+amount**, never Ty’s total balance. Slide 10 starts a separate Bacoin example at **100 / 100**; its one-coin request yields **99 / 101**, followed by **109 / 91** for a ten-coin winning reply or unchanged **99 / 101** for a data-only loss. These figures also omit fees on both accepted requests. The actual Core implementation charges its configured fee in addition to the transfer amount; a data-only block has a zero recipient amount but still incurs the configured transaction fee. Omitting coin accounting from the messaging view does not imply free requests. Mention these simplifications briefly in presenter notes rather than adding fee labels to the diagrams.

Account labels **123**, **456**, and **789** are readable teaching examples, not usable Core account numbers. The supplied model uses 64-character hexadecimal account numbers. Names identify the people for this introduction; account numbers identify the records.

“Mint 100” establishes the illustrative starting balance. It must not imply that an ordinary connected wallet can arbitrarily raise its balance or that connecting mints coins. The supplied administration tools can create account records and set starting balances; this chapter need not introduce that setup interface.

Core checks and saves the block and balances before sending updates to connected apps. The receiving application interprets and displays the payload. Payment submission and authenticated live connections are distinct channels in the supplied implementation; the simple diagram does not assert that ordinary payments are submitted over the live connection. Keep these distinctions while using the requested ten-slide scope.

The following optional local author references were used to check these distinctions. This document and the authored request contain the necessary teaching rules; building, running, and testing this app do not require these sibling repositories or their files:

- [Core request and connection examples](../../Core/README.rst): payment submission, account connections, incoming blocks, and balance updates.
- [Core account model](../../Core/core/accounts/models/account.py) and [account constants](../../Core/core/core/constants.py): balance storage, update notifications, and account-number length.
- [Core block model](../../Core/core/blocks/models/block.py), [validation](../../Core/core/blocks/serializers/block.py), and [request handling](../../Core/core/blocks/views/block.py): amount, payload, fees, recipient credits, and notifications after saving.
- [Core administration registration](../../Core/core/accounts/admin.py) and [DBDC Chapter 7](../../DBDC/chapters/07_operating_a_bank/README.md): administrative starting balances.
- [DBDC Chapter 3](../../DBDC/chapters/03_the_block_payments_and_application_messages/README.md), [Chapter 4](../../DBDC/chapters/04_balances_fees_and_transaction_integrity/README.md), and [Chapter 5](../../DBDC/chapters/05_real_time_communication_through_banks/README.md): one block format, fee accounting, and live updates distinct from payment submission.

## Controls and review

Use ordinary chapter and slide navigation for all ten slides, with no phase controls. Preserve existing navigation shortcuts. Pause/resume and Replay stay outside the canvas; Replay resets the current slide without changing its URL. Slides 4, 6, 7, 8, and 10 wait for their Send or Send Ping button in both normal and reduced motion. Never advance slides on a timer.

Inspect every route at desktop and mobile sizes in normal and reduced motion. Verify server-only slide 1, Bucky-only minting on slide 2, the green status inside slide 3’s phone, and slide 4 waiting until pointer or keyboard Send activation. Check one transfer despite repeated activation, request arrival before balance changes and Ty’s row, and reset behavior. Verify the comparison order Coins only / Data only / Coins + data, To Ty on each card, exact examples, Payload field labels, no Data/Empty row in Coins only, and no amount in Data only. Test the initial message fields, immediate clearing on Send, Bucky’s request path, Ty’s received bubble only on arrival, and reply typing beginning exactly two seconds later without sending. Verify the roughly 160 ms character cadence and that Ty’s Send remains disabled until the complete reply is visible. Verify Ty’s manual Send clears his field, sends the reply through Core, and reveals Bucky’s received bubble only on arrival. The final state must have two incoming bubbles and two empty fields, with no further send until a reset. Check pause/resume during both the delay and partial typing, reduced-motion timing, and cancellation/reset on Replay, reentry, and reload. Confirm Bucky/Ty labels remain beneath the phones, the read-only To inputs show the opposite recipient above Message, and no contact-name header or Amount field appears.

For slide 7, verify the default 99/1 → 98/2 transfer and an edited valid amount/message from 1 through 99. Check that the receipt remains +amount rather than Ty’s 1 + amount balance. Reject invalid amounts, keep Ty fixed, update the records only at Core arrival, and reveal the matching receipt only at Ty’s phone arrival. Check repeated activation cannot duplicate the transfer, no reply appears, keyboard sending, pause/resume, reduced motion, and all reset paths restore the defaults.

For slide 8, verify idle 0.00 s and no auto-start, keyboard/pointer Send Ping, all four roughly 1400 ms travel legs, automatic Pong only after laptop receipt, and the timer stopping only at phone receipt. Pause mid-route and confirm both the request and timer hold. Check one activation per demonstration, replay/reentry/reload cancellation, and reduced-motion completion only after a click with 0.00 s. Inspect balanced vertical margins and the absence of account/amount/table/JSON/Ty elements.

For slide 9, compare the standalone layout with slide 1 and verify the Bacoin spelling and emblem. For slide 10, test default guess 1 and winning guess 5, plus invalid/out-of-range/noninteger input. Verify the initial 100/100, first Core change to 99/101, laptop-only decision, reply-Core win change to 109/91, unchanged loss balances, and phone-only result/coin reveal. Check no coin indicator on loss, no early result, repeated-Send protection, pause on each leg, reduced motion, and all resets returning to guess 1 and 100/100. Keep the fixed answer off the idle canvas.

Across all slides, check text fit and canvas bounds, labels above servers, tables to their right, no standalone mint caption or adjacent coin, the server’s perspective-aligned currency emblem, curved wire endpoints, and no outside connection-status labels or arrowheads.
