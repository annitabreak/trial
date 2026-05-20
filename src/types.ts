export interface Hotspot {
  id: string;
  name: string;
  description: string;
  // Spherical coordinates in degrees
  lat: number;
  lon: number;
  category: 'architecture' | 'interior' | 'history' | 'urban';
}

export interface FloorInfo {
  id: number;
  name: string;
  tagline: string;
  description: string;
  targetLat: number; // Camera latitude when viewing this floor
  targetLon: number; // Camera longitude when viewing this floor
  stats: {
    label: string;
    value: string;
  }[];
}

export interface LocalStatus {
  time: string;
  date: string;
  weatherTemp: string;
  weatherCondition: string;
  windSpeed: string;
  sunsetTime: string;
}
