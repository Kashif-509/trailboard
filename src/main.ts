import './style.css';
import { getJSON } from './api';
import type { Trail, User, Conditions } from './types';
import { trailItem, conditionsTable } from './render';
import { sortByDifficulty } from './sort';
import { drawElevation } from './chart';
import { debounce } from './utils';

const $ = <T extends HTMLElement>(sel: string) => document.querySelector(sel) as T;

// Below-the-fold widget: only fetch it when it is about to scroll into view.
function loadConditionsWhenVisible() {
  const target = $('#conditions');
  const io = new IntersectionObserver(async (entries) => {
    if (!entries.some((e) => e.isIntersecting)) return;
    io.disconnect();
    const conditions = await getJSON<Conditions>('/api/conditions');
    target.innerHTML = conditionsTable(conditions);
  }, { rootMargin: '200px' });
  io.observe(target);
}

async function boot() {
  // The two requests the first screen needs run in parallel.
  const [user, trails] = await Promise.all([
    getJSON<User>('/api/user'),
    getJSON<Trail[]>('/api/trails'),
  ]);

  $('#greeting').textContent = `Hi, ${user.name}`;
  $('#trail-list').innerHTML = trails.map(trailItem).join('');
  loadConditionsWhenVisible();

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

  // Promo banner still arrives late, but into space that is already reserved.
  setTimeout(() => {
    const promo = document.createElement('div');
    promo.className = 'promo';
    promo.innerHTML = 'Winter gear sale: 20% off microspikes this week<br><small>Free shipping on orders over 50</small>';
    $('#promo-slot').appendChild(promo);
  }, 800);
}

boot();
