[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/Amburadullzz/makefun-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/Amburadullzz/makefun-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

# Leonida Ledger — a GTA VI trophy guide and tracker

An offline guide and progress tracker for all 55 PlayStation 5 trophies of
Grand Theft Auto VI. Open `app/index.html` from any static server and it runs
with the network off: every script, stylesheet, icon and byte of trophy data
is a file inside `app/`, and the page requests nothing from anywhere else.

What is in it:

- **The tracker.** All 55 trophies with their official name, description and
  grade, a checkbox each, progress saved in `localStorage`, and export/import
  of a progress file so a run can be backed up or moved to another machine.
- **Filters** by kind (story, strangers, collectibles, activities, crime,
  money, secrets, online), a missable view, and a free-text search.
- **A spoiler setting** that blanks the names and descriptions of story
  trophies until they are earned.
- **A guide per trophy** in this entry's own words: what to do, where, how,
  the window it lives in, and a named source with a link for every specific
  claim.
- **A roadmap to the platinum** in seven stages, built from the official
  descriptions and the chapter, mission and collectible counts they imply.

The trophy names, descriptions and grades are PlayStation's, reproduced as
published; everything else is written for this entry. Sources are cited, never
copied.

## Files

    app/index.html          the page shell
    app/data/trophies.json  the 55 trophies, their guides, sources and roadmap
    app/src/                the app: state, filters, views, styles
    main.ts                 copies app/ and screenshots/ to $MAKEFUN_OUTPUT_DIR
                            and writes dossier.json with vendor/makefun-frontend.ts
    serve.ts                a small static server for app/ (node serve.ts)

Run it locally with `node serve.ts` and open http://localhost:8080, or hand it
in with `mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts`.

## Checking it

`tools/` holds the checks used while building this entry; none of it is part of
the app or of what `main.ts` hands in.

    node tools/verify-trophies.mjs      55 of 55 names, descriptions and grades
                                        diffed against the frozen official list
    node tools/browser-check.mjs        headless Chromium: boot, 55 rows, no
                                        console error, checkbox + reload,
                                        export/clear/import, every request local
    node tools/check-references.mjs     every load-time reference in app/ is a
                                        file under app/
    node tools/screenshots.mjs          the four screenshots, from the app itself
    python3 tools/optimize-screenshots.py   shrink them under 256 KiB

MIT licensed. Not affiliated with Rockstar Games or Take-Two Interactive.
