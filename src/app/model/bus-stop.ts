export interface BusStop {
  id: number;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
}