"""Story and side-strand trophies: the main chapters, the character strands, the meta pair."""

STORY = [
    dict(
        id=1, name="Vice Got a Price!", grade="platinum", kind="meta", stage="platinum",
        description="Congratulations! You're a Leonida Legend.",
        chapter="Endgame", window="No window: every part stays open after the credits",
        missable=False,
        guide=(
            "The platinum is a receipt for the other 54: it has no separate objective and no online, "
            "multiplayer or DLC step, and there is no difficulty setting to pick. One playthrough covers "
            "the list, with a single Chapter 1 exception - the balcony meditation counted by Positive "
            "Mental Attitude - so take that before Chapter 1 closes. PowerPyx puts the run at roughly 200 "
            "hours at 4/10 difficulty; the long pole is A Long Road and its 100% checklist, not any single "
            "mission."
        ),
        steps=[
            "Take the Chapter 1 balcony meditation first; it is the only thing the platinum can lose.",
            "Play the 91 story missions of Chapters 1-5; twelve story trophies fall out of them.",
            "Finish the seven side strands, then the open-world activities and collections.",
            "Close out with the 100% checklist, which is A Long Road, and the platinum follows.",
        ],
        sources=["powerpyx", "leonipedia-list", "sixtrack"],
    ),
    dict(
        id=2, name="Just Like Paradise", grade="bronze", kind="story", stage="spine",
        description="Complete Gone Fishing.",
        chapter="Chapter 1", window="No window: story mission",
        missable=False,
        guide=(
            "Gone Fishing is the second mission of the game, straight after the Prologue, and the first "
            "one you play as Jason: a smuggling drop with Cal and Donnie that goes wrong in Kingfishers "
            "country. Nothing optional sits inside it, so finishing the mission is the whole job - the "
            "trophy lands on the results screen. If you are replaying for cleanup, this is already done; "
            "story missions cannot be replayed once the credits roll."
        ),
        steps=[
            "Finish the Prologue, which hands straight into Gone Fishing.",
            "Follow Cal through the boat drop and the Kingfishers camp.",
            "Complete the mission; the trophy pops with the mission-complete screen.",
        ],
        sources=["leonipedia", "gtabase-missions"],
    ),
    dict(
        id=3, name="Paradise Lost", grade="bronze", kind="story", stage="spine",
        description="Complete Chapter 1.",
        chapter="Chapter 1", window="No window: story mission",
        missable=False,
        guide=(
            "Chapter 1 is 22 missions running from the Prologue to the chapter finale, and the trophy is "
            "awarded for closing it. It arrives late: the counter only ticks over after What's in the Bag?, "
            "the first main mission of Chapter 2, so do not panic when the chapter ends and nothing pops. "
            "There is no missable step in the chapter for this trophy itself, though the Chapter 1 "
            "meditation for Positive Mental Attitude closes at the same time."
        ),
        steps=[
            "Clear the 22 Chapter 1 missions, ending with the chapter finale.",
            "Play the first Chapter 2 mission, What's in the Bag?, and the trophy appears.",
        ],
        sources=["leonipedia", "gta6bugs-missions"],
    ),
    dict(
        id=4, name="T**s Ass Drug Money", grade="bronze", kind="story", stage="spine",
        description="Complete Chapter 2.",
        chapter="Chapter 2", window="No window: story mission",
        missable=False,
        guide=(
            "Chapter 2 holds 11 main missions and ends with Checking Out; the trophy is late by one, "
            "unlocking after Welcome to Vice City, the opening mission of Chapter 3. Chapter 2 is also "
            "where the two protagonists start roaming together, after Coffee Break, which unlocks several "
            "partner trophies - so it is worth doing the optional work in this chapter before pushing on."
        ),
        steps=[
            "Play the 11 Chapter 2 missions through Checking Out.",
            "Start Chapter 3 with Welcome to Vice City; the trophy unlocks there.",
        ],
        sources=["leonipedia", "gta6bugs-missions"],
    ),
    dict(
        id=5, name="Vice City, Baby!", grade="bronze", kind="story", stage="spine",
        description="Complete Chapter 3.",
        chapter="Chapter 3", window="No window: story mission",
        missable=False,
        guide=(
            "Chapter 3 is the longest at 26 missions and the chapter that hands over the tools most of the "
            "list depends on: the Snap Gun for silent jewelry jobs, the Dye Pack Jammer for fencing marked "
            "bills, and the Key Cloner for high-end cars. The chapter trophy does not pop on the finale - it "
            "waits for Ocean Beach and Another Life, the first two missions of Chapter 4."
        ),
        steps=[
            "Clear the 26 Chapter 3 missions; pick up the Snap Gun, Dye Pack Jammer and Key Cloner as they come.",
            "Play Ocean Beach and Another Life in Chapter 4 to collect the trophy.",
        ],
        sources=["leonipedia", "gtabase-missions"],
    ),
    dict(
        id=6, name="Top Of The World, Ma", grade="bronze", kind="story", stage="spine",
        description="Complete Chapter 4.",
        chapter="Chapter 4", window="No window: story mission",
        missable=False,
        guide=(
            "Chapter 4 runs 25 missions and closes with Starting From Zero; the trophy is awarded when that "
            "final mission ends, so it is one of the few chapter trophies that arrives on time. Chapter 4 is "
            "also where the optional vault mission opens, which is the gateway to Maximum Withdrawal, A "
            "Classic Blitz Play and the best money in the game."
        ),
        steps=[
            "Play the 25 Chapter 4 missions, including Child's Play, Headliners and VCIA Takedown.",
            "Finish Starting From Zero, the chapter finale, to collect the trophy.",
        ],
        sources=["leonipedia", "gta6bugs-missions"],
    ),
    dict(
        id=7, name="You Gotta Know When to Get Off", grade="gold", kind="story", stage="spine",
        description="Complete the final mission.",
        chapter="Chapter 5", window="No window: story mission",
        missable=False,
        guide=(
            "The gold for finishing the campaign: The End of the Road, the last of Chapter 5's seven "
            "missions. Sources disagree on the trigger - Leonipedia names The End of the Road, while "
            "PowerPyx ties it to Starting From Zero, the Chapter 4 finale - so expect it either at the "
            "credits or one mission earlier. Free roam continues afterwards, but finished missions cannot "
            "be replayed and there is no New Game+, so keep a manual save before the finale if you care "
            "about the other ending."
        ),
        steps=[
            "Play Chapter 5 through Operation Savage Glory to The End of the Road.",
            "Keep a manual save before the finale: the ending depends on choices and missions cannot be replayed.",
            "Finish the last mission; free roam and every remaining trophy stay open.",
        ],
        sources=["leonipedia", "powerpyx", "missables"],
    ),
    dict(
        id=8, name="Trust", grade="bronze", kind="story", stage="spine",
        description="Complete Breakfast Run.",
        chapter="Chapter 2", window="No window: story mission",
        missable=False,
        guide=(
            "Breakfast Run is a Chapter 2 main mission and the trophy fires during it rather than at the "
            "results screen, so it can appear before the mission is over. There is nothing to prepare and "
            "nothing optional inside it; the only thing worth knowing is that it is one of the missions that "
            "opens the partner content, so the chapter is worth slowing down in."
        ),
        steps=[
            "Progress Chapter 2 until Breakfast Run appears.",
            "Play it through; the trophy unlocks before the mission ends.",
        ],
        sources=["leonipedia", "sixtrack"],
    ),
    dict(
        id=9, name="Break the Bank", grade="bronze", kind="story", stage="spine",
        description="Complete The Cartel Heist.",
        chapter="Chapter 3", window="No window: story mission",
        missable=False,
        guide=(
            "A Chapter 3 story mission, so the trophy is automatic. Do not confuse it with the optional bank "
            "vault robberies: those belong to Maximum Withdrawal and only open later, with the Chapter 4 "
            "mission That's Where The Money Is... The Cartel Heist is scripted, pays whatever it pays, and "
            "leaves the vault system untouched."
        ),
        steps=[
            "Reach The Cartel Heist in Chapter 3 and complete it.",
            "Ignore the vault side content here; it unlocks a chapter later.",
        ],
        sources=["leonipedia", "powerpyx"],
    ),
    dict(
        id=10, name="Family Matters", grade="bronze", kind="story", stage="spine",
        description="Complete Child's Play.",
        chapter="Chapter 4", window="No window: story mission",
        missable=False,
        guide=(
            "Child's Play is a Chapter 4 main mission and the trophy is automatic. GTA VI has no gold-medal "
            "objectives inside missions, so there is no optional goal you can fail and no way to come out of "
            "the mission without the trophy. Headliners, the mission behind DWNFALL, sits in the same "
            "chapter."
        ),
        steps=[
            "Play Chapter 4 to Child's Play and finish it.",
            "No optional objective exists; the trophy is unavoidable.",
        ],
        sources=["leonipedia", "gtabase-missions"],
    ),
    dict(
        id=11, name="DWNFALL", grade="bronze", kind="story", stage="spine",
        description="Complete Headliners.",
        chapter="Chapter 4", window="No window: story mission",
        missable=False,
        guide=(
            "Headliners is a Chapter 4 main mission and the trophy is awarded by the mission itself. Nothing "
            "to prepare, nothing to miss, and no difficulty setting changes it. It shares the chapter with "
            "Child's Play, which carries Family Matters, so a single pass through Chapter 4 clears both."
        ),
        steps=[
            "Play Chapter 4 to Headliners and complete it.",
            "The trophy unlocks with the mission.",
        ],
        sources=["leonipedia", "sixtrack"],
    ),
    dict(
        id=12, name="Hi-Jacked", grade="bronze", kind="story", stage="spine",
        description="Complete VCIA Takedown.",
        chapter="Chapter 4", window="No window: story mission",
        missable=False,
        guide=(
            "VCIA Takedown is a Chapter 4 main mission set at Vice City International Airport, and the trophy "
            "is automatic. It is separate from the airport stunt trophy Catch Me If You Can, which needs a "
            "stolen airliner and can be done in free roam at any time - finishing this mission does not "
            "award that one."
        ),
        steps=[
            "Play Chapter 4 to VCIA Takedown and finish the mission.",
            "Do not expect Catch Me If You Can here; that is a free-roam stunt.",
        ],
        sources=["leonipedia", "powerpyx"],
    ),
    dict(
        id=13, name="Snow Storm", grade="bronze", kind="story", stage="spine",
        description="Complete Operation Savage Glory.",
        chapter="Chapter 5", window="No window: story mission",
        missable=False,
        guide=(
            "Operation Savage Glory is a Chapter 5 main mission and the trophy is automatic. Chapter 5 is "
            "short - seven missions - and runs from here to The End of the Road, so this one arrives close "
            "to the gold for finishing the campaign."
        ),
        steps=[
            "Play Chapter 5 to Operation Savage Glory.",
            "Complete the mission; the trophy unlocks with it.",
        ],
        sources=["leonipedia", "gta6bugs-missions"],
    ),
    dict(
        id=22, name="Road to Rehabilitation", grade="bronze", kind="story", stage="strands",
        description="Complete the final mission for Andy.",
        chapter="Chapter 3 strand", window="No window: the strand stays open after the credits",
        missable=False,
        guide=(
            "Andy's strand is Lucia's alone and opens in Chapter 3: Andy phones her, then texts his home "
            "address in Belville, which puts the strand on the map. It is five quests, starting with "
            "Climbing the Cellerichain (played in three parts) and ending with Puff Puff Pass at the "
            "warehouse, which is the one that pays the trophy. Leonipedia reports it stays playable in free "
            "roam after the credits and that it does not count toward Strangers & Freaks, so do not expect "
            "it to help that silver."
        ),
        steps=[
            "In Chapter 3, take Andy's call and read the text that marks Belville.",
            "Play the five quests in order; the first is Climbing the Cellerichain.",
            "Finish Puff Puff Pass (Meet at the Warehouse) for the trophy.",
        ],
        sources=["leonipedia", "powerpyx"],
    ),
    dict(
        id=23, name="This Was No Boat Accident", grade="bronze", kind="story", stage="strands",
        description="Complete the final mission for Kenton.",
        chapter="Chapter 1 strand", window="No window: Kenton returns later and the strand survives the credits",
        missable=False,
        guide=(
            "Kenton Rees runs the treasure-diving strand. It starts in Chapter 1, a while after the mission "
            "Island Dreams, when Kenton calls and a green KR icon appears in Key Lento; the work is diving "
            "shipwrecks with a metal detector and selling each batch back at his shop. He goes quiet after "
            "Chapter 1 and picks up again in Chapter 2 or 3 - phoning Brian as Jason late in Chapter 2 "
            "brings the text forward. Seven wrecks in all, and the last mission pays the trophy."
        ),
        steps=[
            "After Island Dreams, answer Kenton's call and visit the KR icon in Key Lento.",
            "Dive the marked wrecks, dig with the metal detector, and return each batch.",
            "Finish the seventh wreck's mission for the trophy; the strand reopens if Kenton goes quiet.",
        ],
        sources=["leonipedia", "powerpyx"],
    ),
    dict(
        id=24, name="The Lone Rider", grade="bronze", kind="story", stage="strands",
        description="Complete the final mission for Billy.",
        chapter="Chapter 2 strand", window="No window: all five quests stay open after the credits",
        missable=False,
        guide=(
            "Billy's strand appears after the Chapter 2 mission Coffee Break, at the Thrillbilly Mud Club in "
            "Kelly County, and runs five quests from Thrillbillies (Check Out the Mud Club) to Hometown "
            "Heroes (Join Billy on a Job), which pays the trophy. The first quest also opens the club's eight "
            "races, six on dirt and two on the oval - useful for Earn Cash, Not Kudos, which wants wins in 20 "
            "different races."
        ),
        steps=[
            "After Coffee Break, drive to the Thrillbilly Mud Club and start Thrillbillies.",
            "Play the strand's five quests in order.",
            "Finish Hometown Heroes for the trophy; the club races stay open for Earn Cash, Not Kudos.",
        ],
        sources=["leonipedia", "powerpyx"],
    ),
    dict(
        id=25, name="Strangers & Freaks", grade="silver", kind="story", stage="strands",
        description="Complete 8 mission strands for strangers across the state of Leonida.",
        chapter="Across the story", window="At risk: Race Against Yago is an hourglass mission in Chapter 3",
        missable=True,
        missable_reason=(
            "The trophy counts strands, and one of them can be lost: Race Against Yago is a timed mission in "
            "Chapter 3 and letting its hourglass run out can close Yago's strand for good, leaving the "
            "counter short of eight (Game Checklists; Leonipedia). Every other strand survives the credits."
        ),
        guide=(
            "Eight strands is a counting job, not a tour: not every stranger questline counts toward the "
            "silver. The only reliable check is the trophy counter in the list - read it before and after a "
            "strand's last mission. Leonipedia had four counting strands confirmed at the time of writing, so "
            "plan on playing more than eight and watch for hourglass missions, which fail if you dawdle. "
            "Doing Race Against Yago the moment it appears is the one thing that protects the trophy."
        ),
        steps=[
            "Open the trophy list and note the counter before each strand's final mission.",
            "Work through the strands most likely to count - Andy, Kenton, Billy, Randy, Tyrone, Bret and Cal - and watch the counter after each.",
            "Start any mission with an hourglass icon immediately, especially Race Against Yago in Chapter 3.",
            "Re-check the counter until it reads eight.",
        ],
        sources=["leonipedia", "missables", "powerpyx"],
    ),
    dict(
        id=26, name="Supply & Demand", grade="bronze", kind="story", stage="strands",
        description="Complete the final mission for Randy.",
        chapter="Chapter 3 strand", window="No window: deliveries stay open after the credits",
        missable=False,
        guide=(
            "Randy's Wish List is a car-thief strand. It opens after the Chapter 3 mission Clonin' Keys, "
            "Makin' GS (Steal the Zorrusso for Randy), which also hands over the Key Cloner and delivers the "
            "first car, a Granforma Zorrusso. The list lives under Robberies in the map, Randy's marker is a "
            "green RK icon in western Vice City, and the WAiNK app tells you whether a car you are looking at "
            "is on it. PowerPyx counts 16 sports cars; its money guide says 18."
        ),
        steps=[
            "Play Clonin' Keys, Makin' GS in Chapter 3 and keep the Key Cloner.",
            "Open Randy's Wish List under Robberies and work down it.",
            "Steal the listed sports cars, checking each with WAiNK, and deliver them to the RK icon.",
        ],
        sources=["leonipedia", "powerpyx"],
    ),
    dict(
        id=27, name="Spin On This!", grade="bronze", kind="story", stage="strands",
        description="Complete the final mission for Tyrone.",
        chapter="Chapter 3 strand", window="No window: the strand survives the credits",
        missable=False,
        guide=(
            "Tyrone's strand is Jason's and opens after the Chapter 3 mission Here, Kitty Kitty: purple "
            "markers point at Synthetic Labs around Vice City, and the first quest is Take Out Kitty Litter. "
            "After enough labs Tyrone hands over a second quest, Spin On This (Shut Down the Labs), and that "
            "one pays the trophy. How many labs are needed is not documented yet, so treat the strand as open "
            "ended and keep destroying them. Each lab also counts as an optional task toward 100%."
        ),
        steps=[
            "After Here, Kitty Kitty, look for the purple Synthetic Labs markers as Jason.",
            "Clear Take Out Kitty Litter, destroying labs until Tyrone calls again.",
            "Finish Spin On This (Shut Down the Labs) for the trophy.",
        ],
        sources=["leonipedia", "powerpyx"],
    ),
    dict(
        id=29, name="Fair Game", grade="bronze", kind="story", stage="strands",
        description="Hunt a unique animal for Bret.",
        chapter="Chapter 2 strand", window="No window: Bret's decks stay open after the credits",
        missable=False,
        guide=(
            "Bret Vogel's hunting strand reaches Jason only, some time after the Chapter 2 mission Coffee "
            "Break, by text. The opener is Veteran Hunted (Meet Bret) in Lummox County; after that Bret marks "
            "hunting grounds in purple and asks for particular animals, which make up the 15 Target Decks - "
            "and 100% completion wants every deck, so the trophy comes with the checklist. The unique animal "
            "is the trophy's own requirement and arrives inside the strand rather than in the decks."
        ),
        steps=[
            "Wait for Bret's text to Jason after Coffee Break and play Veteran Hunted.",
            "Work the purple hunting grounds; track decks under Activities or Contacts.",
            "Finish the request that asks for the unique animal to unlock the trophy.",
        ],
        sources=["leonipedia", "powerpyx", "gtaculture"],
    ),
]
