import _ from 'lodash';
import moment from 'moment/min/moment-with-locales';

export function timeAgo(iso: string): string {
  return moment(iso).fromNow();
}

export function km(n: number): string {
  return `${_.round(n, 1)} km`;
}

export const debounce = _.debounce;
