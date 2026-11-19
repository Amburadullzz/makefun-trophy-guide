// The guide drawer: the trophy's official text, its guide in the app's own words, the steps, the
// missable verdict and the sources each fact is cited to.

import { el, clear, gradeMark } from '../ui/dom.js';
import { KIND_LABELS, displayName, displayDescription } from '../data.js';
import { stageOf } from '../roadmap.js';

function section(title, ...children) {
  return el('section', { class: 'section' }, el('h3', { class: 'section__title' }, title), ...children);
}

/** The URL without its scheme and trailing slash, so a long path wraps in the drawer. */
function shortUrl(url) {
  return url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
}

function sourceCard(source) {
  const own = !source.url;
  return el(
    'div',
    { class: `source${own ? ' source--own' : ''}` },
    el('div', { class: 'source__name' }, source.url
      ? el('a', { href: source.url, target: '_blank', rel: 'noopener noreferrer' }, source.name)
      : source.name),
    source.url
      ? el('div', { class: 'source__url', title: source.url }, shortUrl(source.url))
      : el('div', { class: 'source__url' }, 'no link: this entry wrote it'),
    el('div', { class: 'source__covers' }, source.covers),
  );
}

function counterBlock(trophy, store, onChange) {
  const value = store.counterFor(trophy.id);
  const input = el('input', {
    type: 'number',
    min: '0',
    max: String(trophy.target.count),
    value: String(value),
    'aria-label': `Progress for ${trophy.name}`,
  });
  const fill = el('div', { class: 'counter__fill' });
  const paint = (count) => {
    fill.style.width = `${Math.min(100, Math.round((count / trophy.target.count) * 100))}%`;
  };
  paint(value);
  input.addEventListener('change', () => {
    const count = Math.max(0, Math.min(trophy.target.count, Number(input.value) || 0));
    input.value = String(count);
    paint(count);
    onChange(count);
  });
  return el(
    'div',
    {},
    el('div', { class: 'counter' }, input, el('div', { class: 'counter__bar' }, fill), el('span', { class: 'counter__of' }, `/ ${trophy.target.count} ${trophy.target.unit}`)),
    el('p', { class: 'source__covers', style: 'margin-top:6px' }, 'The target is PlayStation\'s own counter for this trophy, cited below. Filling it marks the trophy earned.'),
  );
}

export function renderDrawer(node, context) {
  const { trophy, data, store, revealed, onClose, onToggle, onCounter, onReveal } = context;
  clear(node);
  const earned = store.isEarned(trophy.id);
  const stage = stageOf(data, trophy);

  const body = el('div', { class: 'drawer__inner' });

  body.append(
    el(
      'div',
      { class: 'drawer__top' },
      gradeMark(trophy.grade),
      el('h2', { class: 'drawer__title', id: 'drawer-title' }, displayName(trophy, revealed)),
      el('button', { type: 'button', class: 'button button--icon', 'aria-label': 'Close the guide', onclick: onClose }, '×'),
    ),
    el('p', { class: 'drawer__desc' }, `“${displayDescription(trophy, revealed)}”`),
    el(
      'div',
      { class: 'drawer__row' },
      el('span', { class: 'kind' }, KIND_LABELS[trophy.kind] ?? trophy.kind),
      el('span', { class: 'kind' }, trophy.grade),
      stage ? el('span', { class: 'kind' }, `stage ${stage.id} · ${stage.title}`) : null,
      trophy.missable ? el('span', { class: 'flag' }, 'missable') : el('span', { class: 'lock' }, 'not missable'),
      earned ? el('span', { class: 'kind', style: 'color:#4fd6ae;border-color:#4fd6ae' }, 'earned') : null,
    ),
  );

  if (!revealed) {
    body.append(
      el(
        'div',
        { class: 'section' },
        el(
          'div',
          { class: 'note' },
          el('b', {}, 'Spoiler mode is on. '),
          'This is a story trophy, so its name, description and guide stay hidden until it is earned. ',
          el('button', { type: 'button', class: 'button', style: 'margin-top:8px', onclick: onReveal }, 'Show it anyway'),
        ),
      ),
      el('p', { class: 'source__covers', style: 'margin-top:14px' }, 'Sources are still listed below: nothing here is uncited, whether or not the text is covered.'),
    );
  } else {
    body.append(
      section('The guide', el('p', { class: 'guide-text' }, trophy.guide)),
      section('Steps', el('ol', { class: 'steps' }, ...trophy.steps.map((step) => el('li', {}, step)))),
      section(
        'Can it be missed?',
        el(
          'div',
          { class: `note ${trophy.missable ? 'note--missable' : 'note--safe'}` },
          el('b', {}, trophy.missable ? 'Yes. ' : 'No. '),
          trophy.missable ? trophy.missableReason : 'Nothing in the official description ties this one to a closing window: it stays available in free roam after the credits.',
        ),
      ),
    );
  }

  if (trophy.target) {
    body.append(section('Counter', counterBlock(trophy, store, onCounter)));
  }

  body.append(
    section(
      'Sources',
      el('div', { class: 'sources' }, ...trophy.sources.map(sourceCard)),
      el('p', { class: 'source__covers', style: 'margin-top:8px' },
        'Every specific claim above is one of these three: the official list for the wording, PSN\'s counter for a number, this entry\'s reading of the description for the method.'),
    ),
  );

  body.append(
    el(
      'div',
      { style: 'margin-top:22px' },
      el(
        'button',
        { type: 'button', class: `button ${earned ? '' : 'button--primary'}`, style: 'width:100%', onclick: () => onToggle(trophy.id, !earned) },
        earned ? 'Mark as not earned' : 'Mark as earned',
      ),
    ),
  );

  node.append(body);
}
