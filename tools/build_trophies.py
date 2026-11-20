"""Build app/data/trophies.json and app/data/roadmap.json.

Run from the repository root:  python3 tools/build_trophies.py
It reads the three content modules, expands the source keys, checks the result
against the official 55-name list the kit ships, and writes the data files.
"""

import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, HERE)

from sources import SOURCES  # noqa: E402
from content_story import STORY  # noqa: E402
from content_activities import ACTIVITIES  # noqa: E402
from content_collections import COLLECTIONS  # noqa: E402

OFFICIAL = "/data/workspace/makefun/kits/tg-kit/starter/app/data/trophies.json"
OUT_DATA = os.path.join(ROOT, "app", "data", "trophies.json")
OUT_ROADMAP = os.path.join(ROOT, "app", "data", "roadmap.json")

STAGES = [
    dict(
        id="chapter1", order=1, short="Ch.1 window",
        title="Chapter 1: the one window that closes",
        when="Before the Chapter 1 finale",
        goal="Take the balcony meditation before the chapter ends, and sweep Jason's house while you can.",
        detail=(
            "Chapter 1 is the only part of the game with a hard point of no return that costs a trophy. "
            "One morning after Down to Earth, Lucia says she is going to meditate; follow her onto the "
            "balcony and accept. That is one of the 18 meditations the Positive Mental Attitude trophy asks "
            "for, and it is never offered again. While the house is still yours, also play the home console "
            "and finish Shirley's tasks - neither is a trophy, both are easier now."
        ),
        trophies=[28],
    ),
    dict(
        id="spine", order=2, short="Story spine",
        title="The spine: 91 missions across five chapters",
        when="Chapters 1-5",
        goal="Play the campaign straight through; twelve trophies are awarded by the story alone.",
        detail=(
            "Nothing in the main story can be missed - no difficulty setting, no gold-medal objectives, no "
            "branching mission failure. Three chapter trophies arrive a mission or two late (Paradise Lost "
            "in Chapter 2, T**s Ass Drug Money in Chapter 3, Vice City, Baby! in Chapter 4), so do not read "
            "the delay as a bug. Missions cannot be replayed and there is no New Game+, so keep a manual "
            "save before the Chapter 5 finale if you want the other ending."
        ),
        trophies=[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    ),
    dict(
        id="strands", order=3, short="Strands",
        title="Side strands and the partner jobs",
        when="Chapter 2 onwards, finishing after the credits",
        goal="Run the seven character strands and the two-partner robberies; one strand can be lost to a timer.",
        detail=(
            "Strangers & Freaks counts eight strands and not every strand counts, so read the trophy counter "
            "before and after each strand's final mission. The one timed risk is Race Against Yago in Chapter "
            "3: start it the moment the hourglass appears. The rest - Andy, Kenton, Billy, Randy, Tyrone, "
            "Bret and Cal - survive the credits. Partner trophies need the two protagonists roaming together, "
            "which opens with Coffee Break in Chapter 2."
        ),
        trophies=[20, 22, 23, 24, 25, 26, 27, 29, 33, 34, 39],
    ),
    dict(
        id="money", order=4, short="Money",
        title="Money: launder it, spend it, buy the garages",
        when="Chapter 3 onwards, once the Dye Pack Jammer and the estate app are yours",
        goal="Turn robberies into the four economy trophies without grinding.",
        detail=(
            "The vault jobs are the engine: up to $205,000 a robbery, which covers Little Boxes ($160,000 for "
            "eight garages) and Treat Yo Self ($100,000 of shopping) in a handful of evenings. Fence the "
            "marked bills to Yasmani for Dime on the Dollar, and buy the garages before chasing On the Spot, "
            "because every registration needs a parking spot."
        ),
        trophies=[52, 53, 54, 55],
    ),
    dict(
        id="activities", order=5, short="Open world",
        title="Open-world activities, robberies and one-off stunts",
        when="Any time; most open with story progress",
        goal="Clear the activity trophies, starting with the ones whose maps you can unfog.",
        detail=(
            "This is the widest group: stunts, races, drone trials, shooting ranges, arcade games, gang "
            "operations, vaults, challenges and a handful of one-off stunts like the airliner at VCIA and the "
            "tank at Mile Zero. None of it is missable, and most of it overlaps with the 100% checklist - 250 "
            "stunts against 300 wanted, 50 challenges against 70, 20 race wins against 30."
        ),
        trophies=[15, 16, 17, 18, 19, 21, 32, 36, 37, 38, 40, 41, 43, 44, 45, 46, 47, 48, 49, 50, 51],
    ),
    dict(
        id="collections", order=6, short="Collections",
        title="Collections and exploration",
        when="Start scanning in Chapter 1, finish after the credits",
        goal="Three card sets, 100 WAiNK scans, 100 vehicles and an unfogged map.",
        detail=(
            "These are the four trophies that reward doing a little all the way through: scan every new "
            "vehicle you pass, scan landmarks as you drive, and pick cards up as you see them. The map unfogs "
            "by flying, and unfogging is what puts the robbery targets on it - so the exploration trophy pays "
            "for itself twice."
        ),
        trophies=[30, 31, 35, 42],
    ),
    dict(
        id="platinum", order=7, short="Platinum run",
        title="100% completion, then the platinum",
        when="After the credits",
        goal="Close the 100% checklist for A Long Road; Vice Got a Price! follows automatically.",
        detail=(
            "The checklist only appears after the credits, under Progress > Stats > 100% Completion, and "
            "everything done before then already counts. It is partial by design: 70 of 80 challenges, 200 of "
            "277 vehicles, 100 of 255 animals, 50 of 66 weapons, 300 of 397 stunts, 100 optional tasks, but "
            "all 39 gang operations, all 8 vaults, every video game and every shooting-range gold."
        ),
        trophies=[14, 1],
    ),
]

POINTS_OF_NO_RETURN = [
    dict(deadline="End of Chapter 1", costs="Lucia's balcony meditation",
         detail="One of the 18 meditations for Positive Mental Attitude, offered once, on the balcony of "
                "Jason's house. After Chapter 2 starts it is gone."),
    dict(deadline="Tourist Trap (late Chapter 1)", costs="Jason's house and the cash in your pocket",
         detail="The mission ends the house; bank what you are carrying first. Nothing here is a trophy, but "
                "the home console and the house collectibles go with it."),
    dict(deadline="Checking Out (Chapter 2 finale)", costs="The Starlet Motel safehouse",
         detail="Use it before the mission if you rely on it for outfits, storage or saves."),
    dict(deadline="Race Against Yago (Chapter 3)", costs="Yago's strand, and possibly Strangers & Freaks",
         detail="An hourglass mission: it fails if you leave it. Start it as soon as it appears."),
    dict(deadline="The final mission (Chapter 5)", costs="Nothing trophy-wise, but the other ending",
         detail="Missions cannot be replayed and there is no New Game+. Keep a manual save before the finale."),
]


def expand(entries):
    out = []
    for e in entries:
        item = dict(e)
        item["sources"] = [dict(key=k, **SOURCES[k]) for k in item["sources"]]
        out.append(item)
    return out


def stage_of(trophy_id):
    for s in STAGES:
        if trophy_id in s["trophies"]:
            return s
    raise SystemExit("trophy %r belongs to no stage" % trophy_id)


def main():
    trophies = expand(STORY + ACTIVITIES + COLLECTIONS)
    trophies.sort(key=lambda t: t["id"])

    official = json.load(open(OFFICIAL, encoding="utf-8"))["trophies"]
    by_name = {t["name"]: t for t in official}

    problems = []
    for t in trophies:
        ref = by_name.get(t["name"])
        if ref is None:
            problems.append("not in the official list: %r" % t["name"])
            continue
        if ref["description"] != t["description"]:
            problems.append("description differs: %r" % t["name"])
        if ref["grade"] != t["grade"]:
            problems.append("grade differs: %r" % t["name"])
        if len(t["guide"].split()) < 40:
            problems.append("guide too short: %r" % t["name"])
        if len(t.get("steps", [])) < 2:
            problems.append("fewer than two steps: %r" % t["name"])
        if t["kind"] not in ("story", "activities", "collectibles", "meta", "online"):
            problems.append("bad kind: %r" % t["name"])
        if t["missable"] and not t.get("missable_reason"):
            problems.append("missable without a reason: %r" % t["name"])
        if not t["sources"]:
            problems.append("no sources: %r" % t["name"])
        stage = stage_of(t["id"])
        t["roadmap"] = stage["title"]
        t["roadmapShort"] = stage["short"]
        t["stage"] = stage["id"]
        t["spoiler"] = t["kind"] == "story"
        t.setdefault("missable_reason", None)
        for field in ("window", "chapter", "roadmap"):
            if not str(t.get(field, "")).strip():
                problems.append("empty %s: %r" % (field, t["name"]))

    missing = [n for n in by_name if n not in {t["name"] for t in trophies}]
    for m in missing:
        problems.append("missing trophy: %r" % m)
    if len(trophies) != len(official):
        problems.append("count %d != %d" % (len(trophies), len(official)))
    if problems:
        print("\n".join(problems))
        raise SystemExit(1)

    payload = {
        "game": "Grand Theft Auto VI",
        "platform": "PlayStation 5",
        "list": "official 55 trophies as published by PlayStation, read 2026-11-20",
        "counts": {"total": 55, "platinum": 1, "gold": 2, "silver": 6, "bronze": 46, "online": 0},
        "trophies": trophies,
    }
    os.makedirs(os.path.dirname(OUT_DATA), exist_ok=True)
    with open(OUT_DATA, "w", encoding="utf-8") as fh:
        json.dump(payload, fh, ensure_ascii=False, indent=1)
        fh.write("\n")

    roadmap = {
        "stages": [
            dict(s, trophies=s["trophies"]) for s in sorted(STAGES, key=lambda s: s["order"])
        ],
        "pointsOfNoReturn": POINTS_OF_NO_RETURN,
        "notes": {
            "missions": 91,
            "chapters": 5,
            "chapterMissionCounts": {"1": 22, "2": 11, "3": 26, "4": 25, "5": 7},
            "timeToPlatinum": "about 200 hours (PowerPyx), 4/10 difficulty",
        },
    }
    with open(OUT_ROADMAP, "w", encoding="utf-8") as fh:
        json.dump(roadmap, fh, ensure_ascii=False, indent=1)
        fh.write("\n")

    words = sum(len(t["guide"].split()) for t in trophies)
    print("wrote %d trophies, %d guide words, %d stages" % (len(trophies), words, len(STAGES)))


if __name__ == "__main__":
    main()
