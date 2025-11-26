export interface GroundingSource {
  title: string;
  uri: string;
}

export enum AQILevel {
  Good = 'Good',
  Moderate = 'Moderate',
  UnhealthySensitive = 'UnhealthySensitive',
  Unhealthy = 'Unhealthy',
  VeryUnhealthy = 'VeryUnhealthy',
  Hazardous = 'Hazardous',
  Unknown = 'Unknown'
}

export interface AQIData {
  aqi: number | null; // Extracted numeric value if possible
  // Use AQILevel enum to ensure type compatibility with component props and helper functions
  level: AQILevel;
  summary: string;
  recommendation: string;
  sources: GroundingSource[];
  lastUpdated: string;
}