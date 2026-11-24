# apps

A small collection of web app experiments. Each app lives in its own folder and
can be run on its own.

| App | Folder | What it is |
| --- | --- | --- |
| Neolomatic | [`apis/airtable`](apis/airtable) | Neologism generator. Combines two random Greek/Latin prefixes and shows their meanings, derivations and examples. Prefix data is read from Airtable through a small Express server. |
| Tic Tac Toe | [`games/tictactoe`](games/tictactoe) | Tic Tac Toe against the computer (it wins, blocks, then takes the centre). Pick red or blue, keep score, pause with the button or the `P` key. Keyboard accessible, respects `prefers-reduced-motion`, scales to small screens. |

## Requirements

Node.js 20 or newer.

```sh
npm install
```

## Neolomatic

1. Copy `.env.example` to `.env` and set `AIRTABLEKEY` (an Airtable token with
   read access). The app expects a base with `Prefixes` (`PrefixId`, `Prefixes`)
   and `PrefixesData` (`PrefixId`, `Meaning`, `Derived`, `Example`) tables and a
   `Grid view`. Override the base with `AIRTABLE_BASE_ID`, the port with `PORT`
   (default 3000).
2. `npm run start:neolomatic` and open http://localhost:3000.

`apis/airtable/scrape-prefixes.snippet.js` is a browser-console snippet used once
to export the source table to CSV for import into Airtable; it is not part of the
running app.

## Tic Tac Toe

```sh
npm run start:tictactoe   # static server, then open the printed URL + /tictactoe.html
npm test                  # unit tests for the game rules
```

The game is plain ES modules and CSS with no build step; deploy by publishing the
`games/tictactoe` folder to any static host. The Neolomatic server needs a Node
host because it keeps the Airtable key server-side.

## License

No license has been granted. All rights reserved by the author.
