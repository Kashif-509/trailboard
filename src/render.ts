import type { Trail, Conditions } from './types';
import { km, timeAgo } from './utils';

export function trailItem(t: Trail): string {
  return `<li class="trail">
    <h3>${t.name}</h3>
    <span class="score">${t.difficulty ?? '–'}</span>
    <span class="meta">${t.region} · ${km(t.lengthKm)} · +${t.gainM} m · ★ ${t.rating} · updated ${timeAgo(t.updatedAt)}</span>
  </li>`;
}

export function conditionsTable(c: Conditions): string {
  const rows = c.items
    .map((i) => `<tr><td>${i.region}</td><td>${i.status}</td><td>${i.tempC}°C</td><td>${i.windKph} km/h</td></tr>`)
    .join('');
  return `<h2>Live trail conditions</h2>
    <p class="meta">Updated ${timeAgo(c.updatedAt)}</p>
    <table><thead><tr><th>Region</th><th>Status</th><th>Temp</th><th>Wind</th></tr></thead><tbody>${rows}</tbody></table>`;
}
