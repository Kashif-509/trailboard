import Chart from 'chart.js/auto';
import type { Trail } from './types';

export function drawElevation(canvas: HTMLCanvasElement, trails: Trail[]): Chart {
  const top = trails.slice(0, 5);
  return new Chart(canvas, {
    type: 'line',
    data: {
      labels: top[0].profile.map((_, i) => `${i}`),
      datasets: top.map((t) => ({ label: t.name, data: t.profile, tension: 0.3, pointRadius: 0 })),
    },
    options: { responsive: true, animation: false, plugins: { legend: { labels: { color: '#e8efe9' } } } },
  });
}
