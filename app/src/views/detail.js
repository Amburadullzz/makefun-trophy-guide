// The guide panel: one trophy's official text, this entry's guide, its steps,
// its missable window and the sources behind every specific claim.

import { el, mount } from '../ui/dom.js';
import { KIND_LABELS } from '../filters.js';
import { displayName, displayDescription, isHidden, peek, isPeeked } from '../spoiler.js';

function sourceItem(source) {
  return el('li', {}, [
    el('div', { class: 'source-name' }, source.name),
    source.url
      ? el('a', {
          class: 'source-url',
          href: source.url,
          target: '_blank',
          rel: 'noreferrer noopener',
        }, source.url)
      : el('span', { class: 'source-url' }, 'No public link — print guide'),
    el('div', { class: 'source-covers' }, source.covers ?? ''),
  ]);
}

function missableCallout(trophy) {
  if (trophy.missable) {
    return el('div', { class: 'callout callout-danger' }, [
      el('strong', {}, 'Missable'),
      trophy.missableReason ?? 'This one can be lost.',
    ]);
  }
  if (trophy.status === 'unsolved') {
    return el('div', { class: 'callout callout-warn' }, [
      el('strong', {}, 'No confirmed method yet'),
      trophy.missableReason ?? 'Published guides had no verified unlock on 19 November 2026, so bank a manual save before you experiment.',
    ]);
  }
  return el('div', { class: 'callout callout-safe' }, [
    el('strong', {}, 'Not missable'),
    trophy.missableReason ?? 'It stays available in free roam after the credits.',
  ]);
}

/** The panel shown before any trophy is picked. */
function emptyGuide(data) {
  return el('div', { class: 'guide-empty' }, [
    el('p', {}, 'Pick a trophy to read its guide, its steps and its sources.'),
    el('p', {}, `${data.trophies.length} trophies · ${data.counts.platinum} platinum · ${data.counts.gold} gold · ${data.counts.silver} silver · ${data.counts.bronze} bronze`),
  ]);
}

/** Draw the inspector for the open trophy, if any. */
export function renderDetail(container, ctx) {
  const { data, store, state } = ctx;
  const trophy = state.openId ? data.byId.get(state.openId) : null;
  if (!trophy) {
    mount(container, emptyGuide(data));
    return;
  }

  const earned = state.earned.has(trophy.id);
  const hidden = isHidden(trophy, state) && !isPeeked(trophy.id);
  const stage = data.stages.find((s) => s.id === trophy.stage);

  const head = el('div', { class: 'guide-head' }, [
    el('div', { class: 'guide-kicker' }, [
      el('span', { class: `grade grade-${trophy.grade}` }, trophy.grade),
      el('span', {}, KIND_LABELS[trophy.kind] ?? trophy.kind),
      stage ? el('span', {}, `· ${stage.title}`) : null,
    ]),
    el('h2', { class: 'guide-title' }, displayName(trophy, state)),
    el('div', { class: 'guide-official' }, [
      el('span', {}, 'PlayStation description'),
      displayDescription(trophy, state),
    ]),
  ]);

  if (hidden) {
    mount(container, [
      el('div', { class: 'guide' }, [
        head,
        el('div', { class: 'spoiler-cover' }, [
          el('strong', {}, 'Story spoiler hidden'),
          el('p', {}, 'The spoiler setting hides this trophy\'s name, description and guide until you earn it.'),
          el('button', {
            class: 'btn',
            type: 'button',
            onclick: () => {
              peek(trophy.id);
              store.openTrophy(trophy.id);
            },
          }, 'Reveal this one'),
        ]),
      ]),
    ]);
    return;
  }

  const actions = el('div', { class: 'btn-row' }, [
    el('button', {
      class: earned ? 'btn' : 'btn btn-primary',
      type: 'button',
      onclick: () => store.toggleEarned(trophy.id),
    }, earned ? 'Mark as not earned' : 'Mark as earned'),
  ]);

  mount(container, [
    el('div', { class: 'guide' }, [
      head,
      el('div', { class: 'guide-section' }, [
        el('h4', {}, 'The guide'),
        el('div', { class: 'guide-body' }, [el('p', {}, trophy.guide)]),
      ]),
      trophy.steps?.length
        ? el('div', { class: 'guide-section' }, [
            el('h4', {}, 'Steps'),
            el('ol', { class: 'steps' }, trophy.steps.map((step, index) =>
              el('li', { dataset: { step: String(index + 1) } }, step))),
          ])
        : null,
      el('div', { class: 'guide-section' }, [
        el('h4', {}, 'Window'),
        el('div', { class: 'callout callout-safe' }, [
          el('strong', {}, 'When you can get it'),
          trophy.window ?? 'Any time.',
        ]),
      ]),
      el('div', { class: 'guide-section' }, [missableCallout(trophy)]),
      el('div', { class: 'guide-section' }, [
        el('h4', {}, 'Sources'),
        el('ul', { class: 'sources' }, (trophy.sources ?? []).map(sourceItem)),
      ]),
      el('div', { class: 'guide-section' }, [actions]),
    ]),
  ]);
}
