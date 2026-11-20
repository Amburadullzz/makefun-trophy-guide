"""Collection and exploration trophies."""

COLLECTIONS = [
    dict(
        id=28, name="Positive Mental Attitude", grade="bronze", kind="collectibles", stage="chapter1",
        description="Meditate at every spot across Leonida.",
        chapter="Chapter 1 onwards", window="One meditation is offered only in Chapter 1, at Jason's house",
        missable=True,
        missable_reason=(
            "The official description asks for every spot, and one of the 18 meditations - Lucia's, on the "
            "balcony of Jason's house - is offered only during Chapter 1 and is gone once Chapter 2 starts. "
            "Whether the trophy actually needs it is not yet confirmed; the 100% checklist needs only 15 of "
            "the 18. Sources: Leonipedia meditation guide, PowerPyx roadmap, Game Checklists."
        ),
        guide=(
            "Eighteen meditations across ten spots, and the counter is the thing to watch: Progress > "
            "Collections > Exploration > Meditations. Spots 2 to 9 give two meditations each because Jason and "
            "Lucia both sit, so bring your partner along once switching opens after Chapter 2. The tenth, a "
            "stone circle on the summit of Mount Kalaga (Ascent Mountain), stays hidden until the other "
            "seventeen are done. The odd one out is the balcony at Jason's house in Chapter 1 - do it before "
            "the chapter closes."
        ),
        steps=[
            "In Chapter 1, accept Lucia's offer to meditate on the balcony; it never returns.",
            "Visit the eight map spots with both characters, two meditations per visit.",
            "Finish the seventeenth meditation to reveal Ascent Mountain, then take both characters up.",
            "Confirm 18/18 under Collections > Exploration > Meditations.",
        ],
        sources=["leonipedia", "powerpyx", "missables"],
    ),
    dict(
        id=30, name="Don't Touch My Deck", grade="silver", kind="collectibles", stage="collections",
        description="Complete 3 Collectible Card sets.",
        chapter="Any time", window="No window: cards stay where they are",
        missable=False,
        guide=(
            "Three of the eighteen card sets is the ask, out of 480 unique cards. Ten sets hold 24 cards and "
            "five hold 36; the stragglers are Vice City Club De Futbol with 30, Delights Dancers with 18 and "
            "Backyard Wrestling with 12 - so the wrestling set is the cheapest route to a third. Cards cannot "
            "be bought, only picked up: indoors look on surfaces and walls, outdoors check the yellow phone "
            "boxes and tool boxes. Colour variants count as separate cards. Progress sits under Collections > "
            "Collectible Cards."
        ),
        steps=[
            "Open Collections > Collectible Cards and pick the two smallest sets plus one more.",
            "Sweep indoors first; outdoor cards hide in yellow phone boxes and tool boxes.",
            "Sell duplicates at a pawn shop if you like - a sold card stays in the collection.",
            "Complete three sets; 100% wants fifteen, so keep going.",
        ],
        sources=["leonipedia", "powerpyx-collect"],
    ),
    dict(
        id=31, name="You WAiNKer!", grade="silver", kind="collectibles", stage="collections",
        description="WAiNK It at 100 locations.",
        chapter="Any time", window="No window",
        missable=False,
        guide=(
            "A hundred scans with the phone app, in any mix of sets: 31 Landmarks, 35 Curiosities, 23 "
            "Sculptures, the No Flusher Tags and a fifth set nobody has identified yet. Near a scannable spot "
            "the controller buzzes, a sound plays and a notice appears bottom right; hold up on the d-pad, "
            "point at the starburst icon and press R1. Landmarks, curiosities and sculptures are the "
            "eye-catching ones; No Flusher Tags are paint marks on urban ground. The running total is under "
            "Collections > WAiNK Locations."
        ),
        steps=[
            "Hold up on the d-pad to open WAiNK without going through the phone menu.",
            "Scan landmarks, curiosities and sculptures first; they are the easiest to spot.",
            "Ignore AHOL Street Art and 1010 Murals - they use the app but do not count.",
            "Scan until the counter reads 100, which is also what 100% wants.",
        ],
        sources=["leonipedia", "powerpyx-waink"],
    ),
    dict(
        id=35, name="Whip It Good", grade="bronze", kind="collectibles", stage="collections",
        description="Discover 100 vehicles.",
        chapter="Any time", window="No window",
        missable=False,
        guide=(
            "Discovery means scanning, not driving: open WAiNK with the shortcut, point it at a vehicle you "
            "have not logged and scan it. Park by a busy road and work through the traffic, and remember boats "
            "and aircraft, which are easy to forget. The Vehicles page of the Progress menu shows totals by "
            "category. The 100% checklist wants 200 of the 277 base models, so the trophy is a waypoint rather "
            "than a destination - and standout vehicles found at fixed spots do not count toward that 200."
        ),
        steps=[
            "Scan every new model you pass from the first hour of the story.",
            "Camp a busy Vice City road and scan traffic until the counter climbs.",
            "Cover boats and aircraft too; they are separate categories.",
        ],
        sources=["leonipedia", "powerpyx"],
    ),
    dict(
        id=42, name="The Goodtime State", grade="bronze", kind="collectibles", stage="collections",
        description="Explore all of Leonida.",
        chapter="Any time", window="No window: free roam continues after the credits",
        missable=False,
        guide=(
            "The trophy is the fog: when no part of the map is still black, it unlocks. The quick way is from "
            "the air - take a plane and fly over each dark patch in turn, county by county across Leonida's "
            "five (Vice-Dale, Kelly, Leonard, Lummox and Mariana). Doing it early pays twice, because unfogging "
            "an area is what puts banks, payday loan offices and stick-up stores on the map, and every one of "
            "those is an entry in the 100% checklist."
        ),
        steps=[
            "Steal or buy a plane and take off from any airfield.",
            "Fly a grid over each county, watching for black patches on the map.",
            "Repeat until nothing is left under fog; the trophy fires on the last patch.",
        ],
        sources=["leonipedia", "gta-wiki", "powerpyx"],
    ),
]
