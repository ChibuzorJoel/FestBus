import { Stop } from "./stop";
export interface Route {
    departureTime: string;
    arrivalTime: string;
    duration: number | string; 
    leaveIn: number;
    buses: string[];
    stops: Stop[];
  }
   