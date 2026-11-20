// The numbers in the top bar: the ring, the earned count and the per-grade
// tallies. Redrawn after every change to progress.

import { gradeLetter } from '../core/trophy-data.js';
import { byId } from './dom.js';

const RING_LENGTH = 2 * Math.PI * 27;

export function renderProgressHeader(state) {
  const { data, store } = state;
  const total = data.trophies.length;
  const earned = data.trophies.filter((trophy) => store.has(trophy.id));
  const share = total === 0 ? 0 : earned.length / total;

  const ring = byId('ring-value');
  ring.setAttribute('stroke-dasharray', (RING_LENGTH * share).toFixed(2) + ' ' + RING_LENGTH.toFixed(2));
  ring.style.stroke = share >= 1 ? 'var(--gold)' : share >= 0.5 ? 'var(--teal)' : 'var(--coral)';

  byId('ring-label').textContent = Math.round(share * 100) + '%';
  byId('stat-earned').textContent = String(earned.length);

  const tally = byId('stat-grades');
  for (const chip of tally.querySelectorAll('[data-grade]')) {
    const grade = chip.dataset.grade;
    const all = data.trophies.filter((t) => t.grade === grade);
    const got = all.filter((t) => store.has(t.id));
    chip.textContent = gradeLetter(grade) + ' ' + got.length + '/' + all.length;
  }
}
