// Deterministic fake data for the TrailBoard mock API (no external services).
const NAMES = ['Cedar', 'Falcon', 'Granite', 'Willow', 'Summit', 'Aspen', 'River', 'Juniper', 'Ridge', 'Meadow', 'Hollow', 'Echo'];
const KINDS = ['Loop', 'Trail', 'Pass', 'Traverse', 'Lookout', 'Canyon Walk'];
const REGIONS = ['North Valley', 'East Ridge', 'Lake District', 'High Desert', 'Coastal Range'];

function rng(seed: number) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32);
}

export interface Trail {
  id: number;
  name: string;
  region: string;
  lengthKm: number;
  gainM: number;
  rating: number;
  updatedAt: string;
  profile: number[];
}

export function makeTrails(count = 200): Trail[] {
  const r = rng(42);
  const now = Date.UTC(2026, 10, 20);
  return Array.from({ length: count }, (_, i) => {
    const base = 300 + Math.round(r() * 1500);
    const profile: number[] = [];
    let h = base;
    for (let p = 0; p < 40; p++) {
      h += Math.round((r() - 0.45) * 60);
      profile.push(h);
    }
    return {
      id: i + 1,
      name: `${NAMES[i % NAMES.length]} ${KINDS[Math.floor(r() * KINDS.length)]} ${Math.floor(i / NAMES.length) + 1}`,
      region: REGIONS[Math.floor(r() * REGIONS.length)],
      lengthKm: Math.round((2 + r() * 28) * 10) / 10,
      gainM: Math.round(50 + r() * 1400),
      rating: Math.round((3 + r() * 2) * 10) / 10,
      updatedAt: new Date(now - Math.floor(r() * 30 * 864e5)).toISOString(),
      profile,
    };
  });
}

export const user = { id: 7, name: 'Alex Rivera', homeRegion: 'East Ridge', units: 'metric' };

export const conditions = {
  updatedAt: new Date(Date.UTC(2026, 10, 20, 9, 30)).toISOString(),
  items: [
    { region: 'North Valley', status: 'Clear', tempC: 9, windKph: 12 },
    { region: 'East Ridge', status: 'Snow above 1800 m', tempC: -2, windKph: 30 },
    { region: 'Lake District', status: 'Muddy', tempC: 7, windKph: 8 },
    { region: 'High Desert', status: 'Clear', tempC: 18, windKph: 15 },
    { region: 'Coastal Range', status: 'Fog until noon', tempC: 11, windKph: 20 },
  ],
};
