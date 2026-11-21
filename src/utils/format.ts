// ES-module imports that tree-shake, plus the browser's built-in Intl APIs
// instead of a big date library with every locale.
import debounce from 'lodash-es/debounce';

const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 31536e6], ['month', 2592e6], ['day', 864e5], ['hour', 36e5], ['minute', 6e4],
];

export function timeAgo(iso: string): string {
  const diff = new Date(iso).getTime() - Date.now();
  for (const [unit, ms] of UNITS) {
    if (Math.abs(diff) >= ms || unit === 'minute') return rtf.format(Math.round(diff / ms), unit);
  }
  return 'just now';
}

export function km(n: number): string {
  return `${n.toFixed(1)} km`;
}

export { debounce };
