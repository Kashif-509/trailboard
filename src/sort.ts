import type { Trail } from './types';
import { difficultyScore } from './utils';
import { trailItem } from './render';

// Give the browser a chance to paint and handle input between chunks of work.
// scheduler.yield() keeps our place at the front of the queue; setTimeout is the fallback.
function yieldToMain(): Promise<void> {
  const s = (globalThis as { scheduler?: { yield?: () => Promise<void> } }).scheduler;
  if (s?.yield) return s.yield();
  return new Promise((resolve) => setTimeout(resolve, 0));
}

export async function sortByDifficulty(trails: Trail[], list: HTMLElement, status: HTMLElement): Promise<void> {
  // 1) Instant feedback, then let the browser paint it.
  status.textContent = 'Sorting…';
  await yieldToMain();

  // 2) Score in small chunks instead of one long task.
  for (let i = 0; i < trails.length; i++) {
    trails[i].difficulty ??= difficultyScore(trails[i]);
    if (i % 20 === 19) await yieldToMain();
  }
  trails.sort((a, b) => (b.difficulty ?? 0) - (a.difficulty ?? 0));

  // 3) One DOM write, no layout reads in a loop (no more layout thrashing).
  list.innerHTML = trails.map(trailItem).join('');
  status.textContent = 'Sorted by difficulty';
}
