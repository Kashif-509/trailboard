import type { Trail } from './types';
import { difficultyScore } from './utils';
import { trailItem } from './render';

// Sort button handler. Slow on purpose:
// 1) scores all 200 trails synchronously in one long task
// 2) re-renders, then reads and writes layout in a loop (layout thrashing)
export function sortByDifficulty(trails: Trail[], list: HTMLElement, status: HTMLElement): void {
  for (const t of trails) t.difficulty = difficultyScore(t);
  trails.sort((a, b) => (b.difficulty ?? 0) - (a.difficulty ?? 0));

  list.innerHTML = trails.map(trailItem).join('');

  const items = list.querySelectorAll<HTMLElement>('.trail');
  items.forEach((el) => {
    const h = el.offsetHeight; // read (forces layout)
    el.style.minHeight = `${h + 1}px`; // write (invalidates layout)
  });
  status.textContent = 'Sorted by difficulty';
}
