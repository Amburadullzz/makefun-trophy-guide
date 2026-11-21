// The roadmap view: the order to earn the trophies in, the counts behind each
// stage, and the missable warnings. One job — draw the plan, not the checklist.

import { el, replace, percent } from './dom.js';
import { isMasked, visibleName } from './spoiler.js';

export function createRoadmapView({ catalog, store, elements, onOpenTrophy }) {
  function render() {
    const stages = catalog.roadmap.stages;
    const plan = el('div', { class: 'roadmap' },
      el('div', { class: 'roadmap-main' },
        el('h2', { class: 'sr-only' }, 'Roadmap to the platinum'),
        stages.map((stage) => stageCard(stage))
      ),
      el('div', { class: 'roadmap-aside' },
        missableCard(),
        deadlineCard(),
        countsCard()
      )
    );
    replace(elements.roadmap, plan);
  }

  function stageCard(stage) {
    const earned = stage.trophies.filter((id) => store.earned.has(id)).length;
    const complete = stage.trophies.length > 0 && earned === stage.trophies.length;
    return el('section', {
      class: `stage${complete ? ' is-complete' : ''}`,
      'data-step': String(stage.number),
      'data-stage': stage.id
    },
      el('h3', {}, stage.title, el('span', { class: 'when', text: stage.when || '' })),
      el('p', { class: 'goal', text: stage.goal || '' }),
      el('p', { class: 'why', text: stage.why || '' }),
      stage.counts && stage.counts.length
        ? el('div', { class: 'stage-counts' }, stage.counts.map((count) => el('span', { text: count })))
        : null,
      el('div', { class: 'stage-trophies' },
        el('span', { class: 'board-note', style: 'margin:0 6px 0 0', text: `${earned}/${stage.trophies.length}` }),
        stage.trophies.map((id) => miniTrophy(id))
      ),
      stage.caution ? el('p', { class: 'caution', text: stage.caution }) : null
    );
  }

  function miniTrophy(id) {
    const trophy = catalog.byId.get(id);
    if (!trophy) return null;
    const done = store.earned.has(id);
    const isMaskedTrophy = isMasked(trophy, store.settings, store.earned);
    return el('button', {
      class: `mini${done ? ' is-done' : ''}${isMaskedTrophy ? ' is-masked' : ''}`,
      type: 'button',
      title: isMaskedTrophy ? 'Story trophy — masked by the spoiler shield' : `${trophy.name} — ${trophy.grade}`,
      onclick: () => onOpenTrophy(id)
    },
      el('span', { class: 'pip' }),
      visibleName(trophy, isMaskedTrophy)
    );
  }

  function missableCard() {
    const brief = catalog.roadmap.missableBrief;
    if (!brief) return null;
    const trophy = catalog.byId.get(brief.trophy);
    return el('section', { class: 'aside-card', id: 'missable-brief' },
      el('h3', { text: brief.headline }),
      el('p', { text: brief.body }),
      trophy
        ? el('button', {
            class: 'btn primary',
            type: 'button',
            onclick: () => onOpenTrophy(trophy.id)
          }, `Open ${trophy.name}`)
        : null,
      el('p', { class: 'small', style: 'margin-top:10px' },
        (brief.sources || []).map((source, index) =>
          el('span', {}, index ? ' · ' : '', source.url
            ? el('a', { href: source.url, target: '_blank', rel: 'noopener noreferrer', text: source.name })
            : source.name)
        )
      )
    );
  }

  function deadlineCard() {
    const rows = catalog.roadmap.sideDeadlines || [];
    if (!rows.length) return null;
    return el('section', { class: 'aside-card' },
      el('h3', {}, 'Dates that close'),
      el('table', { class: 'deadline-table' },
        el('thead', {}, el('tr', {},
          el('th', {}, 'What'),
          el('th', {}, 'Closes'),
          el('th', {}, 'Costs')
        )),
        el('tbody', {}, rows.map((row) =>
          el('tr', {},
            el('td', { text: row.what }),
            el('td', { text: row.closes }),
            el('td', { class: 'cost', text: row.cost })
          )
        ))
      ),
      el('p', { class: 'small', style: 'margin-top:8px', text: 'Only the first row costs a trophy; the rest are optional jobs that disappear.' })
    );
  }

  function countsCard() {
    const counted = catalog.trophies.filter((trophy) => trophy.count);
    const total = store.earned.size;
    return el('section', { class: 'aside-card' },
      el('h3', {}, 'Counts the list asks for'),
      el('p', { class: 'small', text: `${counted.length} trophies name a number; the rest are single events.` }),
      el('div', { class: 'stage-counts' },
        counted.map((trophy) => el('span', {
          text: `${visibleName(trophy, isMasked(trophy, store.settings, store.earned))}: ${trophy.count.need}${trophy.count.total !== trophy.count.need ? ' / ' + trophy.count.total : ''}`
        }))
      ),
      el('p', { class: 'small', style: 'margin-top:10px', text: `${total} of ${catalog.trophies.length} earned (${percent(total, catalog.trophies.length)})` })
    );
  }

  return { render };
}
