"""Activity, robbery, collection and money trophies."""

ACTIVITIES = [
    dict(
        id=14, name="A Long Road", grade="gold", kind="meta", stage="platinum",
        description="Attain 100% Completion.",
        chapter="Endgame", window="No window: everything on the checklist stays open in free roam",
        missable=False,
        guide=(
            "100% is a checklist, not a second playthrough, and it appears only after the credits: Progress > "
            "Stats > 100% Completion. PowerPyx's count is partial on purpose - 70 of 80 challenges, 200 of "
            "277 base vehicles scanned, 100 of 255 animals studied, 50 of 66 standard weapons, 300 of 397 "
            "stunts and 100 optional tasks - but it wants every gang operation, bank job, payday loan, vault, "
            "underwater discovery, video game, shooting-range gold, drone trial and hunting deck. Nothing on "
            "it is missable, and work done before the credits already counts."
        ),
        steps=[
            "Scan vehicles and study animals from the first hour; binoculars are enough for animals.",
            "Clear the fixed sets as you go: 39 gang operations, 8 vaults, all payday loans, all video games.",
            "After the credits open Progress > Stats > 100% Completion and read what is left.",
            "Finish the leftovers in free roam; the gold lands with the last entry.",
        ],
        sources=["powerpyx", "leonipedia", "sixtrack"],
    ),
    dict(
        id=15, name="Cunning Stunts", grade="silver", kind="activities", stage="activities",
        description="Complete 250 Stunts.",
        chapter="Any time", window="No window: stunts stay on the map in free roam",
        missable=False,
        guide=(
            "There are 397 stunts and any 250 count. The mix is 202 Under the Bridges, 130 Stunt Jumps off "
            "ramps, 40 Knife Flights between buildings and 25 Base Jumps - and the bridge flights are the "
            "quickest of the four, so a bridge run along the coast clears most of the requirement in an "
            "afternoon. A stunt counts once performed; the small challenge on its map icon is not needed. The "
            "Activities page breaks the count down by category and county, and the 130 jumps are spread over "
            "five counties, Vice-Dale holding 55."
        ),
        steps=[
            "Open the map's Exploration filter and switch on Stunt Spots to see what is left.",
            "Farm Under the Bridges along the coast and the rivers; they are the fastest 202.",
            "Top up with Stunt Jumps in Vice-Dale County if you are short.",
            "Check the Activities page until the counter passes 250.",
        ],
        sources=["leonipedia", "powerpyx"],
    ),
    dict(
        id=16, name="Master of None", grade="bronze", kind="activities", stage="activities",
        description="Try each type of activity once.",
        chapter="Any time", window="No window",
        missable=False,
        guide=(
            "Nine activity types have to be tried once each: fishing, hunting, golf, the shooting ranges, "
            "pool, basketball (one scored hoop is enough), a video game, a stunt, and a won race of any kind - "
            "car race, race challenge or Top Fun drone race. The Activities page of the Progress menu lists "
            "the nine and how often each has been done, so the trophy is a checklist rather than a challenge. "
            "The story introduces most of them; the rest appear as the map unfogs."
        ),
        steps=[
            "Open Progress > Activities and read the nine types with their counters.",
            "Knock off the cheap ones: one hoop, one pool frame, one stunt, one video game.",
            "Win any single race, including a Top Fun drone trial, to close the ninth.",
        ],
        sources=["leonipedia", "powerpyx"],
    ),
    dict(
        id=17, name="The Shootist", grade="silver", kind="activities", stage="activities",
        description="Earn a gold medal in all Shooting Range challenges.",
        chapter="Any time", window="No window: both ranges stay open",
        missable=False,
        guide=(
            "Two ranges hold 42 gold medals between them. Griffin Shooting Range, north-west of Vice City, has "
            "six courses at three difficulty levels - 18 golds, timed obstacle runs. Rodgers Ranch, north-east "
            "of Port Gellhorn, has six courses at four levels - 24 golds, scored from a standing position where "
            "hits build a multiplier and a miss drops it. A $5 Waiver Pass from each range's shop unlocks the "
            "challenges, and renting a weapon for $10 per attempt is good enough for every gold."
        ),
        steps=[
            "Buy the Waiver Pass at each range so the challenges appear on the map.",
            "Clear Griffin's six courses at all three levels: 18 golds.",
            "Clear Rodgers Ranch's six courses at all four levels: 24 golds, keeping the multiplier alive.",
            "Track medals under Progress > Activities > Shooting Ranges.",
        ],
        sources=["leonipedia", "powerpyx"],
    ),
    dict(
        id=18, name="Top Fun", grade="bronze", kind="activities", stage="activities",
        description="Win a Top Fun Drone Race at every location.",
        chapter="Any time", window="No window",
        missable=False,
        guide=(
            "Fourteen Top Fun sites, three time trials each, 42 races in all - and the trophy wants a win at "
            "every site. A site's icon appears when you are within about 100 metres, and the map's Activities "
            "filter lists Top Fun Drones. Beating par on a site's first two trials opens the third. Which "
            "result counts as a win for the trophy is not documented yet, so treat a par time as the target "
            "rather than a finish. Full stick forward and a clean line beat most pars."
        ),
        steps=[
            "Find each site by driving within 100 m, or read the Top Fun Drones map filter.",
            "Beat par on trials one and two to unlock the third.",
            "Win at all 14 sites; 100% wants all 42 trials finished as well.",
        ],
        sources=["leonipedia", "powerpyx"],
    ),
    dict(
        id=19, name="Earn Cash, Not Kudos", grade="bronze", kind="activities", stage="activities",
        description="Win 20 different races.",
        chapter="Chapter 3 onwards", window="No window: race spots stay open",
        missable=False,
        guide=(
            "Forty unique races exist and 20 wins are needed, so half the calendar will do. Seventeen belong "
            "to two street crews - Hit 'N Run VC at four spots in Vice City, Animal Crackers across Lummox and "
            "Mariana - and the rest sit on four tracks: Gellhorn International Raceway has 11, Thrillbilly Mud "
            "Club 8, Boone Speedway 2 elimination races and Ambrosia Raceway 2 demolition races. Entry and car "
            "rental are paid up front and a win more than covers them. Hit 'N Run VC opens in Chapter 3."
        ),
        steps=[
            "Open the map's Racing filter and mark every race spot you have found.",
            "Start at Gellhorn: an intro race leads into a five-race amateur series and then the rest.",
            "Take the eight Thrillbilly Mud Club races once Billy's strand opens the club.",
            "Win 20 different races; 100% wants 30, so keep going past the trophy.",
        ],
        sources=["leonipedia", "powerpyx"],
    ),
    dict(
        id=20, name="Baited My Tackle", grade="bronze", kind="activities", stage="strands",
        description="Beat Cal in a fishing challenge.",
        chapter="Chapter 1 onwards", window="No window: Cal's challenge stays on the map",
        missable=False,
        guide=(
            "Cal Hampton's fishing challenge arrives by text after the Chapter 1 mission Feng Shui, and it "
            "drops a purple fishing icon on the map rather than a story marker. Beat him in the contest and the "
            "trophy is yours. The challenge also counts as one of the 100 optional tasks the 100% checklist "
            "wants, and fishing is one of the nine types Master of None tracks, so it earns its keep three "
            "times over."
        ),
        steps=[
            "Play Feng Shui in Chapter 1 and wait for Cal's text.",
            "Follow the purple fishing icon and take the challenge.",
            "Land the better catch to beat Cal; the trophy follows the result.",
        ],
        sources=["leonipedia", "powerpyx"],
    ),
    dict(
        id=21, name="Stick Fiddler", grade="bronze", kind="activities", stage="activities",
        description="Complete an arcade game.",
        chapter="Any time", window="Console is off limits for most of Chapter 2 and returns in Chapter 3",
        missable=False,
        guide=(
            "Four video games are playable and one of them, cleared level by level, is enough. Tenebrae Lux, "
            "Street Trash III and Time Jackers Rewind run on the JoySystem console by the TV at home; Bang For "
            "Your Buck only exists on arcade machines, one of which stands outside the Bargain World clothing "
            "store in Port Gellhorn. The console is unusable for most of Chapter 2 and comes back in Chapter 3, "
            "which is the only reason to think about timing - the arcade cabinet is always there."
        ),
        steps=[
            "Pick Bang For Your Buck at the Port Gellhorn arcade machine if the console is locked.",
            "Or clear Tenebrae Lux, Street Trash III or Time Jackers Rewind on the JoySystem at home.",
            "Finish every level of that one game; its side challenges do not matter.",
        ],
        sources=["leonipedia", "powerpyx"],
    ),
    dict(
        id=32, name="One Last Thing", grade="bronze", kind="activities", stage="activities",
        description="Complete 50 Challenges.",
        chapter="Any time", window="No window: all 80 challenges are open from the start",
        missable=False,
        guide=(
            "Eighty challenges, ten in each of eight categories - Combat, Criminal, Exploration, Fitness, "
            "Shopping, Sports, Survival and Vehicle - and any 50 count, so the hardest can be skipped. They "
            "have their own page in the Progress menu and a finished one shows a Completed tick when you "
            "highlight it. Leave this until late: most fall out of the other trophies and the 100% checklist, "
            "which itself wants 70, so the trophy arrives on the way."
        ),
        steps=[
            "Open the Challenges page and sort out which ten are closest to done.",
            "Play the other trophies first; they fill most categories without trying.",
            "Finish the quickest remaining challenges to reach 50.",
        ],
        sources=["leonipedia", "powerpyx"],
    ),
    dict(
        id=33, name="Hot Together", grade="bronze", kind="activities", stage="strands",
        description="Lose a 4 star Wanted Level with your partner and escape the heat.",
        chapter="Chapter 2 onwards", window="Needs partner roaming, which opens after Coffee Break",
        missable=False,
        guide=(
            "Once the two protagonists can roam together - after the Chapter 2 mission Coffee Break - call "
            "your partner over, cause enough trouble for four stars and then get clear. The unlock waits until "
            "you are outside the red heat zone, so simply leaving the flashing search area is not enough. A "
            "fast sports bike through traffic is the usual answer, and firing at the helicopter makes it back "
            "off; the railway tunnel north of Ambrosia in Kelly County is a good place to vanish."
        ),
        steps=[
            "After Coffee Break, call your partner to your side.",
            "Raise a four-star wanted level with them along for the ride.",
            "Escape until the red heat zone is behind you, not just the search circle.",
        ],
        sources=["leonipedia", "powerpyx"],
    ),
    dict(
        id=34, name="Retail Therapy", grade="bronze", kind="activities", stage="strands",
        description="Rob 3 shops back-to-back with your partner without losing your Wanted Level.",
        chapter="Chapter 3 onwards", window="Needs partner roaming and the jewelry stores, both Chapter 3",
        missable=False,
        guide=(
            "Three robbery targets, back to back, with your partner beside you and the wanted level never "
            "dropping between them - that is the whole trick, and the red heat level alone does not count. "
            "Chaining the jewelry stores in the north of Vice City is the standard route; take a few items in "
            "each and blow the back-room safe with sticky bombs where you can. Wait about thirty seconds after "
            "leaving the third shop, and keep robbing if the trophy has not appeared."
        ),
        steps=[
            "Unlock partner roaming (Coffee Break) and the jewelry stores (Yasmani's Jewelry Jobs).",
            "Rob three stores in a row without letting the wanted level fall.",
            "Bring a vest, sticky bombs and healing for the chase; wait 30 seconds after the third shop.",
        ],
        sources=["leonipedia", "powerpyx"],
    ),
    dict(
        id=36, name="Gunslinger", grade="bronze", kind="activities", stage="activities",
        description="Take down 5 enemies in a single use of Combat Focus.",
        chapter="Any time", window="No window",
        missable=False,
        guide=(
            "Combat Focus slows time and lights up weak points for a few seconds, and the trophy wants five "
            "enemies down or incapacitated inside one activation. Pick an illegal gang operation for targets - "
            "soldiers, police and civilians seem not to count - and prepare before the fight: eat, drink or wash "
            "at home to fill the purple focus gauge, take Adrenaline to stretch the duration, and wear armour so "
            "you can step out of cover. A full-auto rifle such as the Duke 556 is more accurate than a pistol "
            "or SMG."
        ),
        steps=[
            "Fill focus at home, then take Adrenaline before the fight.",
            "Attack a gang operation where several enemies stand close together.",
            "Trigger Combat Focus with a rifle raised and drop five before it ends.",
        ],
        sources=["leonipedia", "powerpyx"],
    ),
    dict(
        id=37, name="Catch Me If You Can", grade="bronze", kind="activities", stage="activities",
        description="Make an unscheduled departure at VCIA.",
        chapter="Any time", window="No window",
        missable=False,
        guide=(
            "Steal an airliner from Vice City International and fly it out. The plane has to be docked at a "
            "passenger boarding bridge of a departure terminal - the ones parked on the airfield do not count - "
            "and gates E3 and E4 are the usual pick. Climb to the cockpit, reverse onto the runway and take "
            "off; the trophy only fires about a kilometre out. Driving through the perimeter fence and up the "
            "stairs beside the bridge is much quicker than walking the terminal."
        ),
        steps=[
            "Drive through the airfield fence to gates E3/E4 and climb the boarding-bridge stairs.",
            "Enter the airliner, go upstairs to the cockpit and reverse onto the runway.",
            "Take off and fly about 1 km out for the trophy.",
        ],
        sources=["leonipedia", "powerpyx"],
    ),
    dict(
        id=38, name="Challenging Tank", grade="bronze", kind="activities", stage="activities",
        description="Kinda hot in these Rhinos.",
        chapter="Any time", window="No window",
        missable=False,
        guide=(
            "The riddle is a tank: Rhinos. Tanks sit in the southern half of Mile Zero Air Station, the air base "
            "on the island in the far south-west of the map in Mariana County. Get in by driving through the "
            "gate or by taking the stunt jump beside the south-east entrance, then fire at some enemies - the "
            "trophy follows a few shots. It is a free-roam stunt, so it can be done at any point in the story."
        ),
        steps=[
            "Fly or drive to Mile Zero Air Station in southern Mariana County.",
            "Enter the base through the gate or the stunt jump at the south-east entrance.",
            "Board a tank and fire on enemies until the trophy pops.",
        ],
        sources=["leonipedia", "powerpyx"],
    ),
    dict(
        id=39, name="Sneakthief", grade="bronze", kind="activities", stage="strands",
        description="Rob a jewelry store without being detected.",
        chapter="Chapter 3 onwards", window="No window: robbed stores reopen",
        missable=False,
        guide=(
            "The twenty jewelry stores unlock midway through Chapter 3 with the Snap Gun, and the gadget is the "
            "whole trophy: at the back door the game offers a kick, which trips the alarm, or the Snap Gun, "
            "which opens it quietly. Choose the gadget, then keep the alarm disarmed - kicking another door, "
            "smashing a case or a witness can still set it off, and the security panel in the back room turns "
            "it off. The safe code is on a note in the back room. Richardson Jewelry & Diamonds in Vice City is "
            "the usual first try."
        ),
        steps=[
            "Get the Snap Gun from Yasmani's Jewelry Jobs in Chapter 3.",
            "Approach a jewelry store's back door and pick the Snap Gun, never the kick.",
            "Disarm the panel, read the safe code note and empty the safe without being seen.",
        ],
        sources=["leonipedia", "powerpyx"],
    ),
    dict(
        id=40, name="Maximum Withdrawal", grade="silver", kind="activities", stage="activities",
        description="Rob 5 Bank Vaults and escape.",
        chapter="Chapter 4 onwards", window="No window: vaults can be robbed again later",
        missable=False,
        guide=(
            "Five of the eight large vaults, each followed by a clean escape. Every vault runs the same way: "
            "tail a security van to the bank, wait for a guard to carry the case in and the vault to open, slip "
            "in while it stays open, and bring your partner because one character cannot carry it all. Four "
            "stars follow immediately, so escape on a bike through traffic and swap vehicles. The eight banks "
            "are four in Ocean Beach, two in Downtown, one in Tequesta and one at VCIA, and a vault can pay up "
            "to $205,000."
        ),
        steps=[
            "Finish That's Where The Money Is... in Chapter 4 to open vault robberies.",
            "Tail a security van, enter while the vault is open and take both bags with your partner.",
            "Shake the four stars on a fast bike, then change vehicles.",
            "Repeat at any five of the eight banks.",
        ],
        sources=["leonipedia", "powerpyx"],
    ),
    dict(
        id=41, name="A Classic Blitz Play", grade="bronze", kind="activities", stage="activities",
        description="Rob an Armored Truck and escape.",
        chapter="Any time", window="No window",
        missable=False,
        guide=(
            "Two routes, both valid. The slower one is a vault job: robbing a large bank's vault counts as an "
            "armored truck robbery, so the optional Chapter 4 mission that introduces vaults awards it. The "
            "quicker one is on the street - armored trucks circulate near the banks in Vice City, so cut one "
            "off, stick a sticky bomb on the rear doors and detonate it. Either way the trophy waits until you "
            "are out of the red heat zone or through a Pay 'n' Spray."
        ),
        steps=[
            "Buy sticky bombs at Ammu-Nation, or from the fence's back room once his jobs are done.",
            "Ambush an armored truck near a Vice City bank and blow the rear doors.",
            "Take the cash and clear the heat zone for the trophy.",
        ],
        sources=["leonipedia", "powerpyx"],
    ),
    dict(
        id=43, name="Pest Control", grade="bronze", kind="activities", stage="activities",
        description="Rob an Illegal Operation belonging to each gang.",
        chapter="Any time", window="No window: robbed operations come back",
        missable=False,
        guide=(
            "One illegal operation per gang, out of the 39 PowerPyx counts. Entering an operation's area gives "
            "it a yellow icon; story progress marks 19 of the 39 for you, and the map's Robberies filter lists "
            "the ones you have found. Take every key valuable or the robbery does not count as complete - they "
            "are usually one-off weapon variants, watches or a cash safe. The Gangs page of the Progress menu "
            "shows, gang by gang, how many you have robbed."
        ),
        steps=[
            "Open the Robberies map filter and clear each operation's key valuables.",
            "Check Progress > Gangs to see which gangs are still owed a robbery.",
            "Cover the eight named gangs; the ninth is disputed between PowerPyx's guides.",
        ],
        sources=["leonipedia", "powerpyx"],
    ),
    dict(
        id=44, name="In The Beginning…", grade="bronze", kind="activities", stage="activities",
        description="Enjoy a cocktail with a view on Ocean Beach.",
        chapter="Any time", window="No window",
        missable=False,
        guide=(
            "A drink, not a heist. The bar is the rooftop of the Ocean View Hotel on the Ocean Beach seafront "
            "in Vice City - the neon sign is the landmark - and the mistake people make is searching the ground "
            "floor. Get to the upper terrace, order at the rooftop counter and drink it with the view; the "
            "trophy lands shortly after. Atelier Gaming's write-up is the source for the rooftop; treat the "
            "exact route upstairs as approximate, since it may depend on which entrance you use."
        ),
        steps=[
            "Go to Ocean Beach and find the Ocean View Hotel by its neon sign.",
            "Take the stairs or lift to the rooftop terrace rather than the lobby bar.",
            "Order a cocktail at the counter and drink it; the trophy follows.",
        ],
        sources=["atelier-beginning", "powerpyx"],
    ),
    dict(
        id=45, name="Capital Offense", grade="bronze", kind="activities", stage="activities",
        description="Smash your way out of a vehicle showroom in classic style.",
        chapter="Chapter 3 onwards", window="No window: the showroom car respawns",
        missable=False,
        guide=(
            "The blue Banshee in the Sunrise Autos showroom in Southside, South Vice-Dale County, is the car, "
            "and the Key Cloner from the Chapter 3 mission Clonin' Keys, Makin' GS is what lets you take it. "
            "Get in, start it, and drive out through the showroom window - the smash is the trophy. GTAVibes "
            "and PowerPyx both describe the same showroom and the same requirement, and gtaculture still lists "
            "the method as unconfirmed, so read this one as reported rather than settled."
        ),
        steps=[
            "Earn the Key Cloner in Chapter 3's Clonin' Keys, Makin' GS.",
            "Drive to Sunrise Autos in Southside and clone the blue Banshee.",
            "Start it and drive straight out through the showroom glass.",
        ],
        sources=["gtavibes-banshee", "powerpyx", "gtaculture"],
    ),
    dict(
        id=46, name="Let’s Go Bowling", grade="bronze", kind="activities", stage="activities",
        description="Follow-through at the Kolt & Associates' bowling alley.",
        chapter="Chapter 2 onwards", window="No window: the robbed site reopens later",
        missable=False,
        guide=(
            "Kingpin Bowling in Port Gellhorn is a Kolt & Associates illegal operation, introduced by the "
            "optional Chapter 2 mission Hit Kingpin Bowling. Take all three key valuables and then escape the "
            "police - the trophy comes after the escape, not when the last item is grabbed, and the gang "
            "members inside do not have to die. Two valuables carry golden icons: a watch in the south-east "
            "office and the Gutterball Moreland 850 shotgun on a table in the north-east corner; the third is "
            "the office safe, which wants sticky bombs."
        ),
        steps=[
            "Buy sticky bombs, then start Hit Kingpin Bowling in Chapter 2.",
            "Take the watch, the Gutterball shotgun and the safe in the north-east office.",
            "Escape the police for the trophy; the operation also counts for Pest Control.",
        ],
        sources=["leonipedia", "powerpyx"],
    ),
    dict(
        id=47, name="Personal Best", grade="bronze", kind="activities", stage="activities",
        description="A partnership with mass appeal.",
        chapter="Chapter 2 onwards", window="No window: home workouts open after the credits",
        missable=False,
        guide=(
            "Both protagonists have to hold maximum Strength at the same time, which is why this is a "
            "partnership trophy rather than a story one. Character switching opens after Coffee Break; check "
            "each character's Strength under Jason & Lucia in the touchpad menu. A fitness club membership is "
            "the fast route, and calling your partner over before a workout means both train at once. After the "
            "story you can also work out at home, so it cannot be lost."
        ),
        steps=[
            "After Coffee Break, buy a fitness club membership from the Activities map filter.",
            "Call your partner over, then work out so both characters gain Strength together.",
            "Repeat until both are at maximum Strength at the same time.",
        ],
        sources=["leonipedia", "powerpyx"],
    ),
    dict(
        id=48, name="Actions Speak Louder", grade="bronze", kind="activities", stage="activities",
        description="Choices made (for better or worse).",
        chapter="Any time", window="No window: the counter keeps rising",
        missable=False,
        guide=(
            "A long counter that fills as you play: 500 actions that shift your criminal profile, which most "
            "players reach without trying. Turn on the HUD notification for the criminal profile to see a small "
            "demon face whenever one counts, and select the trophy in the list to read the counter. Stealth and "
            "clean getaways push Professional, limb shots that spare enemies push Hardened, kills push Violent "
            "and then Psycho. Farm the rest by running over civilians and police, but stay clear of "
            "Irredeemable, which is permanent."
        ),
        steps=[
            "Enable Settings > UI > HUD Notifications > Criminal Profile to watch the counter move.",
            "Play normally; robberies and fights all feed it.",
            "If short at the end, farm it with vehicles - and stop before the Irredeemable tier.",
        ],
        sources=["leonipedia", "sixtrack"],
    ),
    dict(
        id=49, name="Bad Luck, I Guess", grade="bronze", kind="activities", stage="activities",
        description="Second time's the charm.",
        chapter="Unconfirmed", window="No window known",
        missable=False,
        guide=(
            "No reliable unlock has been published, and this guide will not invent one. The description - "
            "second time's the charm - points at a retry, and PowerPyx's current belief is that it involves the "
            "Payday Loans store seen in the prologue; gtaculture and PlayStationTrophies both still mark the "
            "method unconfirmed. Practical advice: keep a manual save before prologue-era robberies, fail one "
            "and succeed on the second attempt, and check the trophy list after each. It is not flagged "
            "missable by any source."
        ),
        steps=[
            "Keep a manual save before any prologue robbery you attempt.",
            "Try the Payday Loans store twice: fail or abort once, then succeed.",
            "Check the trophy list after each attempt; the method is still unconfirmed.",
        ],
        sources=["sixtrack", "gtaculture", "powerpyx"],
    ),
    dict(
        id=50, name="The Truth Is Out There", grade="bronze", kind="activities", stage="activities",
        description="What the hell just happened?",
        chapter="Chapter 2 onwards", window="No window: the event repeats at night",
        missable=False,
        guide=(
            "A UFO encounter in Kelly County, on the rural road east of Port Gellhorn near the Starlet Motel. "
            "Be there at about 2:00 AM in-game time with Chapter 2 open, and look for a parked car with "
            "flashing lights and open doors; follow the scattered clothes and the static toward the beam of "
            "light. Help the woman on the ground, take the dialogue, then walk back to the road for her "
            "vehicle - which is when the UFO takes you instead. The trophy lands as the encounter closes."
        ),
        steps=[
            "Reach Chapter 2, then travel to the road north-west of the Starlet Motel after 2 AM.",
            "Follow the blinking car, the clothes and the light beam into the trees.",
            "Help the woman, answer the dialogue, then return to the road.",
        ],
        sources=["beebom-ufo", "sixtrack", "gamerant-ufo"],
    ),
    dict(
        id=51, name="Ten Pin", grade="bronze", kind="activities", stage="activities",
        description="Bowl 'em over with a melee drive-by.",
        chapter="Unconfirmed", window="No window known",
        missable=False,
        guide=(
            "Unconfirmed, and flagged as such. The description asks for a melee drive-by that bowls someone "
            "over, and PowerPyx's current belief is that kicking enemies from a moving motorcycle does it - "
            "which matches the wording better than ramming them with a car. Try it in traffic or against a "
            "gang operation: ride alongside a target, melee from the saddle, and check the list. No source "
            "flags it missable."
        ),
        steps=[
            "Ride a motorcycle up beside a pedestrian or gang member.",
            "Use the melee attack from the saddle rather than a weapon.",
            "Check the trophy list; the method is PowerPyx's working theory, not a confirmed one.",
        ],
        sources=["sixtrack", "gtaculture", "powerpyx"],
    ),
    dict(
        id=52, name="Dime on the Dollar", grade="bronze", kind="activities", stage="money",
        description="Earn $250,000 laundering Marked Bills through your contacts.",
        chapter="Chapter 3 onwards", window="No window: deliveries accumulate",
        missable=False,
        guide=(
            "Marked bills come out of banks and payday loan offices and can only be cleaned once the story "
            "hands you the Dye Pack Jammer, which arrives with the Chapter 3 mission Credit Check. Sell the "
            "bills to a fence; the total accumulates across every delivery, so no single huge haul is needed. "
            "Yasmani in Little Cuba pays the most, and large bank vaults are the fastest source at up to "
            "$205,000 a job. The 100% checklist wants the same $250,000 fenced, so the trophy comes with it."
        ),
        steps=[
            "Get the Dye Pack Jammer from Credit Check in Chapter 3.",
            "Rob banks and payday loan offices for marked bills, using vaults once Chapter 4 opens them.",
            "Sell to Yasmani until the running total passes $250,000.",
        ],
        sources=["leonipedia", "powerpyx"],
    ),
    dict(
        id=53, name="Treat Yo Self", grade="bronze", kind="activities", stage="money",
        description="Spend $100,000 across all shops.",
        chapter="Any time", window="No window",
        missable=False,
        guide=(
            "A hundred thousand dollars through the tills, and every kind of shop adds to the same total. Guns, "
            "car modifications and tattoos are the quickest because they are the most expensive things on the "
            "shelves; eight kinds of shop count, among them 24 gun stores, 14 mod shops and 11 tattoo studios, "
            "with clothing, footwear, hair and beauty, electronics and Pay 'n' Spray completing the list. "
            "Weapons bought here also feed A Long Road's 50-of-66 standard weapons requirement."
        ),
        steps=[
            "Bank the money first: robberies in Chapters 3 and 4 pay best.",
            "Spend on weapons, vehicle mods and tattoos, which carry the highest prices.",
            "Top up across clothing, electronics and Pay 'n' Spray until the total passes $100,000.",
        ],
        sources=["leonipedia", "powerpyx"],
    ),
    dict(
        id=54, name="Little Boxes", grade="bronze", kind="activities", stage="money",
        description="Purchase all garage properties.",
        chapter="Chapter 2 onwards", window="No window",
        missable=False,
        guide=(
            "Twelve garages exist but only eight are for sale; the other four come free with story progress and "
            "do not count. The eight cost between $4,000 and $40,000 each, $160,000 in total, and are bought "
            "through the Vice City Real Estate app on the phone, which installs itself shortly after the "
            "Chapter 2 mission Daily Driver. Each one adds at least one parking spot, and those spots are what "
            "On the Spot needs - 18 at most, counting two for personal vehicles left outside."
        ),
        steps=[
            "Wait for the Vice City Real Estate app after Daily Driver in Chapter 2.",
            "Buy the eight garages for sale, cheapest first; skip the four free ones.",
            "Keep the receipt: each garage's parking spots feed On the Spot.",
        ],
        sources=["leonipedia", "powerpyx"],
    ),
    dict(
        id=55, name="On the Spot", grade="bronze", kind="activities", stage="money",
        description="Register 10 vehicles to the Scooter Bros app.",
        chapter="Chapter 2 onwards", window="No window",
        missable=False,
        guide=(
            "Scooter Bros keeps stolen vehicles on record and brings them to you on request, but each "
            "registration needs a parking spot, so buy garages first. The app and Moses's garage in Port "
            "Gellhorn arrive with the Chapter 2 mission Moses; drive a stolen vehicle inside, choose Respray "
            "and then Register. That garage refuses anything with a tracker at first, but later in Chapter 3 "
            "Standard Tracker cars are accepted and any Pay 'n' Spray can register them. Cheap cars and bikes "
            "keep the fees down."
        ),
        steps=[
            "Play Moses in Chapter 2 to install Scooter Bros and open the Port Gellhorn garage.",
            "Buy enough garages for ten parking spots.",
            "Steal cheap cars and bikes, then Respray and Register each one until ten are on the app.",
        ],
        sources=["leonipedia", "powerpyx"],
    ),
]
