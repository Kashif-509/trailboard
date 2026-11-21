import type { Trail } from '../types';

// A deliberately "expensive" difficulty score: walks the elevation profile
// many times, like a real scoring model might.
export function difficultyScore(t: Trail): number {
  let effort = 0;
  for (let pass = 0; pass < 8; pass++) {
    for (let i = 1; i < t.profile.length; i++) {
      const climb = t.profile[i] - t.profile[i - 1];
      effort += Math.abs(Math.sin(climb / 30 + pass)) * (climb > 0 ? 1.4 : 0.6);
    }
  }
  return Math.round((effort / 8) * (t.lengthKm / 10) + t.gainM / 100);
}
