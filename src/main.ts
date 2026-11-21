import './style.css';
import { getJSON } from './api';
import type { Trail, User, Conditions } from './types';
import { trailItem, conditionsTable } from './render';
import { sortByDifficulty } from './sort';
import { drawElevation } from './chart';
import { debounce } from './utils';

const $ = <T extends HTMLElement>(sel: string) => document.querySelector(sel) as T;

async function boot() {
  // Three requests, one after another: each waits for the previous one.
  const user = await getJSON<User>('/api/user');
  const trails = await getJSON<Trail[]>('/api/trails');
  const conditions = await getJSON<Conditions>('/api/conditions');

  $('#greeting').textContent = `Hi, ${user.name}`;
  $('#trail-list').innerHTML = trails.map(trailItem).join('');
  $('#conditions').innerHTML = conditionsTable(conditions);

  // The elevation tab is hidden, but its chart is built right away anyway.
  drawElevation($('#elevation-chart') as HTMLCanvasElement, trails);

  $('#sort-btn').addEventListener('click', () => sortByDifficulty(trails, $('#trail-list'), $('#sort-status')));

  document.querySelectorAll<HTMLButtonElement>('.tab').forEach((tab) =>
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach((t) => t.classList.toggle('active', t === tab));
      $('#panel-list').hidden = tab.dataset.tab !== 'list';
      $('#panel-elevation').hidden = tab.dataset.tab !== 'elevation';
    }),
  );

  window.addEventListener('resize', debounce(() => console.debug('resized'), 200));

  // Late promo banner with no reserved space: pushes everything down.
  setTimeout(() => {
    const promo = document.createElement('div');
    promo.className = 'promo';
    promo.innerHTML = 'Winter gear sale: 20% off microspikes this week<br><small>Free shipping on orders over 50</small>';
    $('#promo-slot').appendChild(promo);
  }, 800);
}

boot();
