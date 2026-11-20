// The right column: the selected trophy's guide, its steps, its missable
// window and the sources each claim came from.

import { gradeLabel } from '../core/trophy-data.js';
import { displayName, displayDescription, isMasked } from '../core/spoiler.js';
import { gradeBadge, kindTag, missableTag } from './trophy-parts.js';
import { h, clear } from './dom.js';

export function renderGuidePanel(root, state, actions) {
  const trophy = state.data.byId.get(state.selectedId);
  clear(root);
  if (!trophy) {
    root.append(
      h('div', { class: 'pane-head' }, h('span', { class: 'pane-title' }, 'Guide')),
      h('div', { class: 'empty-state' },
        h('strong', {}, 'Pick a trophy'),
        h('span', {}, 'Choose any row on the left to read its guide and where it came from.')
      )
    );
    return;
  }

  const earned = state.store.has(trophy.id);
  const masked = isMasked(trophy, state);

  root.append(
    guideHead(trophy, state, actions, earned, masked),
    h('div', { class: 'guide-body', id: 'guide-body' },
      masked ? spoilerCover(trophy, actions) : guideBody(trophy, state)
    )
  );
}

function guideHead(trophy, state, actions, earned, masked) {
  return h('div', { class: 'guide-head' },
    h('div', { class: 'guide-head-top' },
      gradeBadge(trophy),
      h('div', { style: 'min-width:0' },
        h('h2', { class: 'guide-title' }, displayName(trophy, state)),
        h('p', { class: 'guide-desc' }, displayDescription(trophy, state))
      ),
      h('button', {
        type: 'button',
        class: 'guide-earn' + (earned ? ' is-earned' : ''),
        'data-earn-id': trophy.id,
        'aria-pressed': earned,
        onclick: () => actions.toggleEarned(trophy.id),
      }, earned ? '\u2713 Earned' : 'Mark earned')
    ),
    h('div', { class: 'guide-meta' },
      h('span', { class: 'tag' }, gradeLabel(trophy.grade)),
      kindTag(trophy),
      trophy.missable ? missableTag() : null,
      masked ? null : h('span', { class: 'tag' }, trophy.chapter),
      h('span', { class: 'tag' }, trophy.roadmapShort || trophy.roadmap)
    )
  );
}

function spoilerCover(trophy, actions) {
  return h('div', { class: 'spoiler-cover' },
    h('strong', {}, 'Spoiler-safe is on'),
    h('span', {}, 'The name, the description and the guide for this story trophy stay hidden until you mark it earned.'),
    h('div', {},
      h('button', {
        type: 'button',
        class: 'btn',
        onclick: () => actions.peek(trophy.id),
      }, 'Reveal just this one')
    )
  );
}

function guideBody(trophy, state) {
  const sections = [];

  sections.push(
    h('div', { class: 'guide-section' },
      h('p', { class: 'section-label' }, 'How to get it'),
      h('p', { class: 'guide-text' }, trophy.guide)
    )
  );

  if (Array.isArray(trophy.steps) && trophy.steps.length) {
    sections.push(
      h('div', { class: 'guide-section' },
        h('p', { class: 'section-label' }, 'The route'),
        h('ol', { class: 'steps' }, trophy.steps.map((step) => h('li', {}, step)))
      )
    );
  }

  sections.push(
    h('div', { class: 'guide-section' },
      h('p', { class: 'section-label' }, 'When it can be missed'),
      h('p', { class: 'guide-text' }, trophy.window)
    )
  );

  if (trophy.missable) {
    sections.push(
      h('div', { class: 'guide-section' },
        h('div', { class: 'missable-callout' },
          h('p', { class: 'section-label' }, 'Missable'),
          h('p', {}, trophy.missable_reason || 'The official description ties this trophy to a window that closes.')
        )
      )
    );
  }

  sections.push(sourceList(trophy));
  return sections;
}

function sourceList(trophy) {
  return h('div', { class: 'guide-section' },
    h('p', { class: 'section-label' }, 'Sources'),
    h('div', { class: 'sources' },
      trophy.sources.map((source, index) =>
        h('div', { class: 'source' },
          h('span', { class: 'source-index' }, String(index + 1).padStart(2, '0')),
          h('div', {},
            h('span', { class: 'source-name' },
              source.url
                ? h('a', { href: source.url, target: '_blank', rel: 'noopener noreferrer' }, source.name)
                : source.name
            ),
            source.url ? h('span', { class: 'source-url' }, source.url) : null
          )
        )
      )
    ),
    h('p', { class: 'source-note' },
      'Read on 20 November 2026. Links open only if you follow them; this app loads nothing from the network.')
  );
}
