export interface BusStop {
  id: number; 
  name: string;
  avenue: string;
  lat: number;
  lng: number;
  buses: string[];  // Add buses array to BusStop interface
}