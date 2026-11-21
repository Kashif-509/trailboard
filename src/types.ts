export interface Trail {
  id: number;
  name: string;
  region: string;
  lengthKm: number;
  gainM: number;
  rating: number;
  updatedAt: string;
  profile: number[];
  difficulty?: number;
}
export interface User { id: number; name: string; homeRegion: string; units: string }
export interface Conditions {
  updatedAt: string;
  items: { region: string; status: string; tempC: number; windKph: number }[];
}
