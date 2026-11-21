[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/Amburadullzz/makefun-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/Amburadullzz/makefun-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

# Leonida Legend — an offline trophy guide and tracker

A static, build-free web app covering all 55 PlayStation 5 trophies of Grand
Theft Auto VI: the official name, description and grade of every trophy, a
guide in my own words with the sources each claim comes from, a roadmap to the
platinum ordered by the official descriptions, missable flags, and a checklist
whose progress lives in `localStorage` and can be exported to a file and
imported back.

Open `app/index.html` through any static server (`node serve.ts`, then
http://localhost:8080). Everything it loads is a file under `app/`: no fonts,
scripts, images or data come from the network, so it works with the network
off.

## Layout

- `app/index.html` — the shell: masthead, progress board, the two views.
- `app/css/app.css` — the whole look, hand-written, no external assets.
- `app/src/` — ES modules, one job each: `catalog.js` (data + filters),
  `store.js` (progress and settings), `spoiler.js`, `tracker-view.js`,
  `roadmap-view.js`, `transfer.js` (export/import), `dom.js`, `main.js`.
- `app/data/trophies.json` — the 55 trophies: official text, my guide, sources.
- `app/data/roadmap.json` — the roadmap stages and the count table.
- `main.ts` — hands the entry in: copies `app/` and `screenshots/` to
  `$MAKEFUN_OUTPUT_DIR` (else `/output`) and writes `dossier.json`.
- `serve.ts` — a small static server for `app/`.
- `screenshots/` — four renders of the app.

## Run it

    node serve.ts                      # http://localhost:8080
    mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

Trophy names and descriptions are PlayStation's, shown as published. The
guides, the roadmap, the look and the code are this entry's own; every guide
names the wiki, guide site or forum report its facts come from. Not affiliated
with Rockstar Games or Take-Two Interactive.
