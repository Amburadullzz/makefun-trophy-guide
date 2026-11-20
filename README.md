[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/Amburadullzz/makefun-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/Amburadullzz/makefun-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

# Leonida Ledger

An offline guide and tracker for the 55 PlayStation 5 trophies of Grand Theft Auto VI.

Every trophy is there with its official name, description and grade, and with a guide written for this app:
what to do, where, how, and when the description ties it to a window that closes. Each guide names the sources
behind its steps and links them, so a claim about a location, a count or a mission can be traced. Beside the
guides the app carries a seven-stage roadmap to the platinum - story, strands, money, open world, collections,
100% - built from the official descriptions, and a points-of-no-return table for the handful of moments that
close content for good.

The tracker keeps progress in `localStorage`, exports it to a JSON file and imports it back, filters by kind
(story, activities, collectibles, platinum and 100%, online) and by the missable flag, and has a spoiler-safe
switch that hides the name, description and guide of every story trophy you have not earned - with a
"reveal just this one" escape for a single entry.

It is static files with no build step. `app/index.html` opens in a desktop browser with the network off: every
script, stylesheet, icon and data file it loads is a file under `app/`, and it makes no request at run time.
The only links it offers are the citation links in a guide, which open only if you follow them.

## Run it

```sh
node serve.ts              # serves app/ on http://localhost:8080
node main.ts               # stages app/ + screenshots/ into /output and writes dossier.json
MAKEFUN_OUTPUT_DIR=out node main.ts    # the same, into ./out
```

## Layout

```
app/                    the guide: static files, no build step
  index.html            the page
  icon.svg              the app's own mark
  data/trophies.json    the 55 trophies: official name, description, grade, guide, steps, sources
  data/roadmap.json     the seven stages and the points of no return
  styles/               base tokens, page layout, components
  src/core/             data loading, progress store, settings, filters, export/import, spoiler rules
  src/ui/               header, filter rail, checklist, guide panel, roadmap, about, toast
screenshots/            four captures of the running app (the first is the cover)
main.ts                 the entrypoint: stages the entry and writes dossier.json
serve.ts                a tiny static server for app/, for local use
tools/                  data build, trophy-list check, reference check
vendor/                 the kit's makefun-frontend.ts, unchanged
```

## Checks

```sh
node tools/verify_trophies.mjs    # the 55 names against the official list, plus guides and sources
node tools/check_references.mjs   # every reference is a file under app/, nothing goes to the network
```

## Licence

MIT, copyright 2026 Amburadullzz. Trophy names, descriptions and grades are PlayStation's. No Rockstar Games
logo, artwork, box art or game screenshot is used anywhere in the app or its screenshots.
