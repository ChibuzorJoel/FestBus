export interface Stop {
    name: string;
    coords: [number, number];  // Latitude and Longitude
    arrivalTime: string;
    arrivalIn: number;
    avenue: string;
    distance: number; // Travel time in minutes
    distanceKm: number; // Distance in km
  completed?: boolean;
  eta?: number;
  }