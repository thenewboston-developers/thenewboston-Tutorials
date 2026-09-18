import type { Chapter } from './types'

export const chapter01: Chapter = {
  id: 'core-architecture',
  number: 1,
  title: 'Core Architecture',
  description:
    'An independent eight-slide architecture introduction: Core, starting balances, a connected phone, a transfer, request types, messaging, coins with data, and Ping/Pong.',
  sourcePath: 'docs/core-architecture-source.md',
  slides: [
    {
      id: 'architecture-core-server',
      title: 'Bonsai Core.',
      sentence:
        'Bonsai Core is the server that keeps this currency’s account records.',
      talkingPoints: [
        'Bonsai Core is the server at the center of this example.',
        'It holds the account records used to track this currency’s coins.',
        'Start with the server alone; the following slides build the example.',
      ],
      visual: 'architecture-core-server',
    },
    {
      id: 'architecture-core-mint',
      title: 'Mint 100.',
      sentence:
        'The example starts with 100 coins in Bucky’s account, labeled 123.',
      talkingPoints: [
        'Minting establishes the starting balance of 100 coins in Bucky’s account.',
        'Bucky is the only account shown in the table at this point.',
        'Account 123 is a short teaching label; actual Core account numbers are longer.',
        'The starting balance represents administrative setup, not an ordinary wallet increasing its own funds.',
      ],
      visual: 'architecture-core-mint',
    },
    {
      id: 'architecture-core-connect',
      title: 'Connect Bucky’s phone.',
      sentence:
        'Bucky’s phone connects to Bonsai Core and displays a green connection status.',
      talkingPoints: [
        'Bucky’s phone connects to Bonsai Core and shows a green Connected status.',
        'The account record remains at 100; connecting the phone does not transfer coins.',
        'This view introduces the connection before Bucky sends a transfer request.',
      ],
      visual: 'architecture-core-connect',
    },
    {
      id: 'architecture-core-transfer',
      title: 'Send one coin to Ty.',
      sentence:
        'Press Send to move one coin from Bucky’s account to Ty’s account through Core.',
      talkingPoints: [
        'The slide begins waiting, with Bucky at 100 and no transfer in progress.',
        'Press Send to send one request from Bucky’s phone to the Core server.',
        'After arrival, Core records Bucky at 99 and Ty, account 456, at 1.',
        'Fees are omitted from this diagram so the one-coin transfer remains easy to follow.',
      ],
      visual: 'architecture-core-transfer',
    },
    {
      id: 'architecture-request-types',
      title: 'Three ways to use a request.',
      sentence:
        'The same request format carries coins only, data only, or coins with data to Ty.',
      talkingPoints: [
        'Every card addresses Ty; Coins only shows Amount 1 without a payload row.',
        'Data only carries “Hello, Ty”, with no coin amount shown in the example.',
        'Coins + data sends one coin with “Hello, Ty” in the same request.',
        'All three use the same block format; data-only requests still incur Core’s transaction fee.',
      ],
      visual: 'architecture-request-types',
    },
    {
      id: 'architecture-messaging',
      title: 'A conversation through Core.',
      sentence:
        'Send Bucky’s message through Core, then click Send on Ty’s phone after his reply is ready.',
      talkingPoints: [
        'Bucky starts with “Hello, Ty”; Send clears his field as the request travels through Core.',
        'Ty starts empty; two seconds after receipt, “Hey Dad” begins typing character by character.',
        'Ty’s Send stays disabled until typing finishes; your click clears the field and sends the reply.',
        'This view omits coin accounting, but data-only requests still incur the configured transaction fee.',
      ],
      visual: 'architecture-messaging',
    },
    {
      id: 'architecture-coins-data',
      title: 'A coin and a message.',
      sentence:
        'Edit the amount and message, then send both through Core to Ty in one request.',
      talkingPoints: [
        'Choose a whole amount from 1 to 99 and edit “Here you go” before sending.',
        'The fixed recipient is Ty; one request carries both the chosen amount and message.',
        'Continue from Bucky 99 and Ty 1; Core records 98/2 before Ty receives the default one coin.',
        'Ty then sees the message and received coins; this simplified example omits fees and any reply.',
      ],
      visual: 'architecture-coins-data',
    },
    {
      id: 'architecture-ping-pong',
      title: 'Ping. Pong.',
      sentence:
        'Send Ping through Core to the laptop and stop the phone’s timer when Pong returns.',
      talkingPoints: [
        'Press Send Ping to start Bucky’s phone timer and send Ping through Core to the laptop.',
        'On receipt, the Ping-pong app immediately sends Pong back through Core without another click.',
        'The phone timer stops only when Pong reaches Bucky’s phone, completing the full round trip.',
        'This timer follows the illustrative presentation; it makes no network request and is not a benchmark.',
      ],
      visual: 'architecture-ping-pong',
    },
  ],
}
