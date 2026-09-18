# Core Architecture — authored tutorial request

This document records the author’s requested introduction to a new architecture tutorial series. It is presented as **Chapter 1 — Core Architecture** in this independent tutorial app. The introduction contains eight actual slides, each with its own URL position. Slides 1–4 establish the server and transfer, slide 5 compares request types, slide 6 demonstrates messaging, slide 7 combines coins with an editable message, and slide 8 follows a Ping/Pong round trip. There are no phase controls.

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

## Presentation conventions

Use clean native architecture diagrams and generous, readable labels. Slides advance only through ordinary slide navigation, never automatically. Slides 1–3 and 5 are static teaching states; slides 4, 6, 7, and 8 wait for their Send or Send Ping button. No additional architecture layers are part of this introduction.

The optional author references [server.jpg](/Users/bucky/Downloads/server.jpg) and [server2.jpg](/Users/bucky/Downloads/server2.jpg) informed the server style. They are not app assets or build dependencies. Use original native vector art with crisp professional dimensional/isometric construction in dark navy and blue. Polish the phones to the same dimensional style, keeping the screen content flat and readable. Add a Bonsai Coin emblem to the server’s upper-right side panel, following that panel’s isometric perspective.

On slide 4, stack **To** above an input containing **Ty**, then **Amount** above an input containing **1**. Place the **Send** button at the bottom, with the Bonsai coin logo to the right of the Send text. Keep both fields read-only.

Apply the author’s visual directions throughout:

- Put every **Bonsai Core** label above its server, wherever a server appears.
- Place each balance table to the right of its server.
- Remove the standalone **100 minted** caption and the coin beside that caption from every slide.
- When a phone is connected, place Core at the top center and Bucky’s phone at the bottom left. Run a gently curved wire from the top of the phone to the left side of Core, with no arrowheads or outside **Connected** labels. Slide 3’s green **Connected** status belongs inside the phone.
- On slides 6 and 7, vertically center the complete composition with balanced whitespace above the Bonsai Core label and below the Bucky/Ty names, preserving scale, relative positions, wires, and packet paths. Apply the same balanced composition to slide 8’s phone and laptop.

Fees are omitted from the displayed arithmetic and messaging demonstration; this does not make data-only requests free. **123** / **456** are simplified teaching account labels. Brief source and implementation context belongs in presenter notes and [the art-direction document](chapter-01-art-direction.md), keeping the canvas focused on the requested flow.
