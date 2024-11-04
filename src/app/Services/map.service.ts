import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  // Expanded list of bus stops in Festac Town with additional stops
  private busStops = [
    { id: 1, name: 'Festac First Gate', buses: ['23', '45'], coords: [6.465422, 3.306448] },
    { id: 2, name: 'Festac Second Gate', buses: ['23', '45'], coords: [6.466, 3.305] },
    { id: 3, name: 'Festac Third Gate', buses: ['23', '45'], coords: [6.467, 3.304] },
    { id: 4, name: 'Festac Police Station', buses: ['78', '90'], coords: [6.464, 3.308] },
    { id: 5, name: 'Mile 2', buses: ['78', '90'], coords: [6.474, 3.295] },
    { id: 6, name: 'Apple Junction', buses: ['34', '12'], coords: [6.471, 3.292] },
    { id: 7, name: 'Agboju Market', buses: ['12', '56'], coords: [6.470, 3.298] },
    { id: 8, name: 'Amuwo Odofin', buses: ['56', '78'], coords: [6.480, 3.290] },
    { id: 9, name: 'Alakija', buses: ['90', '12'], coords: [6.483, 3.285] },
    { id: 10, name: 'Abule Ado', buses: ['90', '34'], coords: [6.478, 3.280] },
    { id: 11, name: 'Satellite Town', buses: ['78', '90'], coords: [6.490, 3.270] },
    { id: 12, name: 'Okota Road', buses: ['56', '23'], coords: [6.460, 3.290] },
    { id: 13, name: 'Ijegun', buses: ['23', '45'], coords: [6.475, 3.285] },
    { id: 14, name: '1st Avenue', buses: ['23', '45'], coords: [6.469970, 3.296110] },
    { id: 15, name: '2nd Avenue', buses: ['23', '45'], coords: [6.462120, 3.285890] },
    { id: 16, name: '3rd Avenue', buses: ['23', '45'], coords: [6.468300, 3.298700] },
    { id: 17, name: '4th Avenue', buses: ['78', '90'], coords: [6.468600, 3.300500] },
    { id: 18, name: '5th Avenue', buses: ['78', '90'], coords: [6.469000, 3.302000] },
    { id: 19, name: '6th Avenue', buses: ['34', '12'], coords: [6.469500, 3.303500] },
    { id: 20, name: '7th Avenue', buses: ['12', '56'], coords: [6.466445, 3.283514] },
    { id: 21, name: 'Festac Town Hall', buses: ['23', '56'], coords: [6.465200, 3.308000] },
    { id: 22, name: 'Festac Market', buses: ['23', '45', '78'], coords: [6.464800, 3.304700] },
    { id: 23, name: 'Agboju Bus Stop', buses: ['12', '90'], coords: [6.471000, 3.299000] },
    { id: 24, name: 'Mazamaza', buses: ['78', '12'], coords: [6.474500, 3.287500] },
    { id: 25, name: 'Alaba International', buses: ['90', '34'], coords: [6.480200, 3.278400] },
    { id: 26, name: 'Volks Bus Stop', buses: ['90', '56'], coords: [6.482500, 3.275300] },
    { id: 27, name: 'FHA Complex', buses: ['23', '45'], coords: [6.463700, 3.302500] },
    { id: 28, name: 'Festac Bridge', buses: ['78', '90'], coords: [6.470500, 3.293000] },
    { id: 29, name: 'Festac Primary School', buses: ['12', '34'], coords: [6.466000, 3.300000] },
    { id: 30, name: 'Golden Tulip Festac', buses: ['23', '56'], coords: [6.464400, 3.306200] },
    { id: 31, name: 'Abule Osun', buses: ['90', '45'], coords: [6.490000, 3.280000] },
   { id: 32, name: 'Iyana Iba', buses: ['78', '12'], coords: [6.496500, 3.257800] },
{ id: 33, name: 'Ojo Cantonment', buses: ['56', '34'], coords: [6.493800, 3.263000] },
{ id: 34, name: '16 Road', buses: ['23', '90'], coords: [6.467500, 3.299500] },
{ id: 35, name: '21 Road', buses: ['45', '78'], coords: [6.464300, 3.305500] },
{ id: 36, name: '24 Road', buses: ['90', '12'], coords: [6.461800, 3.308900] },
{ id: 37, name: '28 Road', buses: ['34', '56'], coords: [6.467800, 3.301100] },
{ id: 38, name: 'Festival Mall', buses: ['23', '45'], coords: [6.465800, 3.304100] },
{ id: 39, name: 'Amuwo Council', buses: ['12', '78'], coords: [6.470000, 3.293500] },
{ id: 40, name: 'Ijora Causeway', buses: ['34', '90'], coords: [6.480500, 3.281300] }
  ];

  constructor() {}

  // Method to get all nearby bus stops (returns observable)
  getNearbyStops(): Observable<any[]> {
    return of(this.busStops);
  }

  // Method to get user's current location
  getUserLocation(
    successCallback: (position: GeolocationPosition) => void, 
    errorCallback: (error: GeolocationPositionError) => void
  ): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    } else {
      errorCallback({
        code: 1, 
        message: 'Geolocation is not supported by your browser.', 
        PERMISSION_DENIED: 1, 
        POSITION_UNAVAILABLE: 2, 
        TIMEOUT: 3
      } as GeolocationPositionError);
    }
  }

  // Mocked method to get route details
  getRouteDetails(routeId: string): Observable<any> {
    // Adding detailed stops with bus numbers for the 1st Avenue to 7th Avenue route
    const routeDetails = {
      routeId: routeId,
      duration: '30 minutes', // Example duration
      distance: '5 km',       // Example distance
      stops: [
        { id: 1, name: '1st Avenue', buses: ['23', '45'], coords: [6.469970, 3.296110] },
        { id: 2, name: '2nd Avenue', buses: ['23', '45'], coords: [6.462120, 3.285890] },
        { id: 3, name: '3rd Avenue', buses: ['23', '45'], coords: [6.468300, 3.298700] },
        { id: 4, name: '4th Avenue', buses: ['78', '90'], coords: [6.468600, 3.300500] },
        { id: 5, name: '5th Avenue', buses: ['78', '90'], coords: [6.469000, 3.302000] },
        { id: 6, name: '6th Avenue', buses: ['34', '12'], coords: [6.469500, 3.303500] },
        { id: 7, name: '7th Avenue', buses: ['12', '56'], coords: [6.466445, 3.283514] },
        { id: 8, name: 'Festac Phase 1', buses: ['23', '12'], coords: [6.4660, 3.3005] },
        { id: 9, name: 'Festac Phase 2', buses: ['56', '34'], coords: [6.4675, 3.3050] },
        { id: 10, name: 'Road 1', buses: ['11', '29'], coords: [6.4650, 3.3080] },
        { id: 11, name: 'Road 2', buses: ['44', '51'], coords: [6.4640, 3.3060] },
        { id: 12, name: 'Road 3', buses: ['15', '10'], coords: [6.4630, 3.3075] },
        { id: 13, name: 'Link Road', buses: ['90', '12'], coords: [6.4655, 3.3100] },
        { id: 14, name: 'Festac Link', buses: ['23', '34'], coords: [6.4650, 3.3130] },
        { id: 21, name: 'Festac Town Hall', buses: ['23', '56'], coords: [6.465200, 3.308000] },
      { id: 22, name: 'Festac Market', buses: ['23', '45', '78'], coords: [6.464800, 3.304700] },
     { id: 23, name: 'Agboju Bus Stop', buses: ['12', '90'], coords: [6.471000, 3.299000] },
      { id: 24, name: 'Mazamaza', buses: ['78', '12'], coords: [6.474500, 3.287500] },
     { id: 25, name: 'Alaba International', buses: ['90', '34'], coords: [6.480200, 3.278400] },
     { id: 26, name: 'Volks Bus Stop', buses: ['90', '56'], coords: [6.482500, 3.275300] },
{ id: 27, name: 'FHA Complex', buses: ['23', '45'], coords: [6.463700, 3.302500] },
{ id: 28, name: 'Festac Bridge', buses: ['78', '90'], coords: [6.470500, 3.293000] },
{ id: 29, name: 'Festac Primary School', buses: ['12', '34'], coords: [6.466000, 3.300000] },
{ id: 30, name: 'Golden Tulip Festac', buses: ['23', '56'], coords: [6.464400, 3.306200] },
{ id: 31, name: 'Abule Osun', buses: ['90', '45'], coords: [6.490000, 3.280000] },
{ id: 32, name: 'Iyana Iba', buses: ['78', '12'], coords: [6.496500, 3.257800] },
{ id: 33, name: 'Ojo Cantonment', buses: ['56', '34'], coords: [6.493800, 3.263000] },
{ id: 34, name: '16 Road', buses: ['23', '90'], coords: [6.467500, 3.299500] },
{ id: 35, name: '21 Road', buses: ['45', '78'], coords: [6.464300, 3.305500] },
{ id: 36, name: '24 Road', buses: ['90', '12'], coords: [6.461800, 3.308900] },
{ id: 37, name: '28 Road', buses: ['34', '56'], coords: [6.467800, 3.301100] },
{ id: 38, name: 'Festival Mall', buses: ['23', '45'], coords: [6.465800, 3.304100] },
{ id: 39, name: 'Amuwo Council', buses: ['12', '78'], coords: [6.470000, 3.293500] },
{ id: 40, name: 'Ijora Causeway', buses: ['34', '90'], coords: [6.480500, 3.281300] }
      ]
      
    };

    return of(routeDetails); // Change to actual API call
  }

  // Mocked method to get live traffic data
  getLiveTrafficData(routeId: string): Observable<any> {
    const trafficData = {
      status: 'Normal', // e.g., 'Heavy', 'Light', etc.
      delay: 0 // Example delay in minutes
    };

    return of(trafficData); // Change to actual API call
  }

  // Method to get coordinates for a specific location name
  getCoordinatesForLocation(locationName: string): Observable<[number, number]> {
    const stop = this.busStops.find(stop => stop.name.toLowerCase() === locationName.toLowerCase());
    if (stop) {
      return of(stop.coords as [number, number]); // Cast to tuple type to meet TypeScript expectations
    } else {
      console.error(`Location '${locationName}' not found in bus stop data.`);
      return of([0, 0]); // Default coordinates if location not found
    }
  }

  // Method to get stops between two locations based on coordinates
  getStopsBetweenLocations(fromCoords: [number, number], toCoords: [number, number]): Observable<string[]> {
    // For simplicity, we will return all stops that are between the coordinates
    const stopsInRange = this.busStops.filter(stop => 
      this.isStopBetween(fromCoords, toCoords, stop.coords as [number, number]) // Cast stop.coords to tuple
    ).map(stop => stop.name);

    return of(stopsInRange); // Return as observable
  }

  // Helper method to determine if a stop is between two coordinates
  private isStopBetween(fromCoords: [number, number], toCoords: [number, number], stopCoords: [number, number]): boolean {
    const [lat1, lon1] = fromCoords;
    const [lat2, lon2] = toCoords;
    const [stopLat, stopLon] = stopCoords;

    // Check if the stop's latitude and longitude are within the bounding box defined by from and to coordinates
    return (
      Math.min(lat1, lat2) <= stopLat && stopLat <= Math.max(lat1, lat2) &&
      Math.min(lon1, lon2) <= stopLon && stopLon <= Math.max(lon1, lon2)
    );
  }
}
