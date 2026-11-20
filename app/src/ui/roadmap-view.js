// The roadmap view: a one-line summary, seven stages in the order they should
// be played, then the points of no return that close content for good.

import { trophyPill } from './trophy-parts.js';
import { h, clear } from './dom.js';

export function renderRoadmap(root, state, actions) {
  const { data } = state;
  const notes = data.roadmap.notes || {};
  const stages = data.roadmap.stages;

  clear(root);
  root.append(
    h('div', { class: 'roadmap-summary' },
      h('div', { class: 'roadmap-summary-text' },
        h('h2', {}, 'One playthrough, seven stages'),
        h('p', {},
          'The order comes from the official descriptions: the chapter each trophy sits in, the count it asks ' +
          'for, and whether its description ties it to a moment that closes.'
        )
      ),
      h('div', { class: 'facts' },
        h('span', { class: 'fact' }, h('b', {}, String(notes.missions || 91)), ' story missions'),
        h('span', { class: 'fact' }, h('b', {}, String(notes.chapters || 5)), ' chapters'),
        h('span', { class: 'fact' }, h('b', {}, '200 h'), ' to platinum'),
        h('span', { class: 'fact' }, h('b', {}, '4/10'), ' difficulty'),
        h('span', { class: 'fact' }, h('b', {}, String(data.trophies.filter((t) => t.missable).length)), ' missable')
      )
    ),
    h('div', { class: 'stage-list', id: 'stage-list' },
      stages.map((stage) => stageCard(stage, state, actions))
    ),
    pointsOfNoReturn(data.roadmap.pointsOfNoReturn)
  );
}

function stageCard(stage, state, actions) {
  const trophies = stage.trophies.map((id) => state.data.byId.get(id)).filter(Boolean);
  const earned = trophies.filter((t) => state.store.has(t.id)).length;
  const done = earned === trophies.length;

  return h('article', { class: 'stage' + (done ? ' is-done' : ''), 'data-stage': stage.id },
    h('div', { class: 'stage-index' }, String(stage.order).padStart(2, '0')),
    h('div', {},
      h('div', { class: 'stage-head' },
        h('h3', {}, stage.title),
        h('span', { class: 'stage-when' }, stage.when),
        h('span', { class: 'pane-count' }, earned + '/' + trophies.length + ' earned')
      ),
      h('p', { class: 'stage-goal' }, stage.goal),
      h('p', { class: 'stage-detail' }, stage.detail),
      h('div', { class: 'stage-trophies' },
        trophies.map((trophy) => trophyPill(trophy, state.store.has(trophy.id), actions.openTrophy))
      )
    )
  );
}

function pointsOfNoReturn(rows) {
  return h('section', { class: 'panel ponr' },
    h('h2', {}, 'Points of no return'),
    h('p', {},
      'Everything else in the list survives the credits. These are the moments where something stops being ' +
      'available, and the trophy it puts at risk.'
    ),
    h('table', { class: 'ponr-table' },
      h('thead', {}, h('tr', {}, h('th', {}, 'Deadline'), h('th', {}, 'What closes'), h('th', {}, 'Detail'))),
      h('tbody', {}, rows.map((row) =>
        h('tr', {},
          h('td', {}, row.deadline),
          h('td', {}, row.costs),
          h('td', {}, row.detail)
        )
      ))
    )
  );
}
