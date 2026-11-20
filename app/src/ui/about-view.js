// The about view: what the app is, how the kinds and the missable flag were
// decided, the official shape of the list, and every source in one place.

import { h, clear } from './dom.js';

export function renderAbout(root, state) {
  const { data } = state;
  const counts = data.counts;
  const sources = collectSources(data.trophies);
  const missable = data.trophies.filter((t) => t.missable);

  clear(root);
  root.append(
    h('div', { class: 'about-grid' },
      h('div', {},
        h('div', { class: 'panel' },
          h('h2', {}, 'What this is'),
          h('p', {},
            'A static, offline guide and tracker for the 55 PlayStation 5 trophies of Grand Theft Auto VI. It is ' +
            'plain files: no build step, no server code, no request to any network at run time. Progress is kept ' +
            'in this browser under localStorage and moves between machines as a JSON file you export and import.'
          ),
          h('ul', { class: 'about-list' },
            h('li', {}, 'Every trophy carries the official name, description and grade, plus a guide written for this app.'),
            h('li', {}, 'Each guide lists the sources behind its steps, numbered beside the claims they support.'),
            h('li', {}, 'The missable flag is decided from the official description: a trophy is missable when the description ties it to a window that closes.'),
            h('li', {}, 'The roadmap groups the list into seven stages by chapter, count and window, not by convenience.'),
            h('li', {}, 'One official name carries asterisks, \u201cT**s Ass Drug Money\u201d: that is how PlayStation publishes it, not a mask.')
          )
        ),
        h('div', { class: 'panel' },
          h('h2', {}, 'How the kinds are counted'),
          h('table', { class: 'kind-table' },
            h('tbody', {},
              kindRow('story', 'Main chapters and the character strands: anything the game hands you as a mission.'),
              kindRow('activities', 'Free-roam work: races, stunts, ranges, robberies, one-off stunts.'),
              kindRow('collectibles', 'Things you gather or reveal: meditations, cards, WAiNK scans, vehicles, the map.'),
              kindRow('meta', 'The platinum and 100% completion, which are receipts for the rest.'),
              kindRow('online', 'Empty by design: this list has no online, multiplayer or DLC trophies.')
            )
          ),
          h('p', { class: 'source-note', style: 'margin-top:10px' },
            counts.total + ' trophies: ' + counts.platinum + ' platinum, ' + counts.gold + ' gold, ' +
            counts.silver + ' silver, ' + counts.bronze + ' bronze, ' + counts.online + ' online.')
        ),
        h('div', { class: 'panel' },
          h('h2', {}, 'The missable flags, and why only ' + missable.length),
          h('p', {},
            'PlayStation hides 28 of these trophies until they are earned, and most of the list is safe: free roam ' +
            'continues after the credits, robbed sites reopen, and story missions cannot be failed permanently. ' +
            'Two trophies have a closing window that the official description exposes.'
          ),
          h('ul', { class: 'about-list' },
            missable.map((trophy) =>
              h('li', {}, h('strong', {}, trophy.name), ' \u2014 ' + trophy.missable_reason)
            )
          ),
          h('p', { class: 'source-note' },
            'Other near-misses are tracked in the roadmap\u2019s points of no return instead of being flagged: the ' +
            'home console in Chapter 2, Kenton\u2019s silence, the Delights pool opponent, and any mission with an hourglass.'
          )
        )
      ),
      h('div', {},
        h('div', { class: 'panel' },
          h('h2', {}, 'Where the facts come from'),
          h('p', {},
            'The trophy names, descriptions and grades are PlayStation\u2019s, as Exophase, PSNProfiles, GTABase and ' +
            'the wiki mirrors list them. Everything else \u2014 counts, places, chapter timing, unlock methods \u2014 is ' +
            'cited per trophy and gathered here.'
          ),
          h('div', { class: 'sources' },
            sources.map((source, index) =>
              h('div', { class: 'source' },
                h('span', { class: 'source-index' }, String(index + 1).padStart(2, '0')),
                h('div', {},
                  h('span', { class: 'source-name' },
                    h('a', { href: source.url, target: '_blank', rel: 'noopener noreferrer' }, source.name)
                  ),
                  h('span', { class: 'source-url' }, source.url + '  \u00b7  ' + source.uses + ' trophies')
                )
              )
            )
          )
        ),
        h('div', { class: 'panel' },
          h('h2', {}, 'Spoiler-safe, exports and imports'),
          h('p', {},
            'The switch in the header masks the name and description of every story trophy you have not earned, ' +
            'including its guide; a single entry can be revealed without turning the setting off. Export writes ' +
            'a JSON file of the trophies you have earned; import matches them back by name, so a file from an ' +
            'older version of the list still lands on the right rows.'
          )
        ),
        h('div', { class: 'panel' },
          h('h2', {}, 'Honest limits'),
          h('p', {},
            'Two hidden trophies still have no published unlock method (Bad Luck, I Guess and Ten Pin), and a few ' +
            'counts are disputed between guides - the number of gangs for Pest Control, the size of Randy\u2019s car ' +
            'list. Where that happens the guide says so and names both sources rather than inventing a step.'
          )
        )
      )
    )
  );
}

function kindRow(kind, description) {
  return h('tr', {}, h('td', {}, kind), h('td', {}, description));
}

function collectSources(trophies) {
  const seen = new Map();
  for (const trophy of trophies) {
    for (const source of trophy.sources) {
      const entry = seen.get(source.url) || { name: source.name, url: source.url, uses: 0 };
      entry.uses += 1;
      seen.set(source.url, entry);
    }
  }
  return [...seen.values()].sort((a, b) => b.uses - a.uses || a.name.localeCompare(b.name));
}
