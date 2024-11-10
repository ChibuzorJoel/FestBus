import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

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
    { id: 40, name: 'Ijora Causeway', buses: ['34', '90'], coords: [6.480500, 3.281300] },
    { id: 41, name: 'Main Street', buses: ['25', '37'], coords: [6.4710, 3.2915] },
{ id: 42, name: 'Central Park', buses: ['22', '34'], coords: [6.4695, 3.2885] },
{ id: 43, name: 'East Gate', buses: ['21', '32'], coords: [6.4600, 3.2820] },
{ id: 44, name: 'South Park', buses: ['26', '46'], coords: [6.4595, 3.2790] },
{ id: 45, name: 'North Plaza', buses: ['15', '42'], coords: [6.4625, 3.2870] },
{ id: 46, name: 'Market Square', buses: ['31', '54'], coords: [6.4700, 3.3240] },
{ id: 47, name: '8th Road', buses: ['23', '43'], coords: [6.4678, 3.3338] },
{ id: 48, name: '10th Avenue', buses: ['11', '27'], coords: [6.4699, 3.3355] },
{ id: 49, name: 'Community Center', buses: ['17', '39'], coords: [6.4680, 3.3290] },
{ id: 50, name: 'Library Road', buses: ['16', '48'], coords: [6.4658, 3.3205] },
{ id: 51, name: 'Stadium Avenue', buses: ['12', '40'], coords: [6.4642, 3.3180] },
{ id: 52, name: 'Hilltop Drive', buses: ['45', '60'], coords: [6.4687, 3.3075] },
{ id: 53, name: 'Riverbank Road', buses: ['28', '33'], coords: [6.4667, 3.3110] },
{ id: 54, name: 'Town Square', buses: ['30', '49'], coords: [6.4635, 3.3150] },
{ id: 55, name: '9th Close', buses: ['10', '55'], coords: [6.4681, 3.3278] },
{ id: 56, name: 'Sunny Street', buses: ['14', '57'], coords: [6.4693, 3.3284] },
{ id: 57, name: 'Western Road', buses: ['20', '38'], coords: [6.4672, 3.3035] },
{ id: 58, name: 'Kingsway', buses: ['13', '52'], coords: [6.4712, 3.3279] },
{ id: 59, name: 'Sunset Boulevard', buses: ['29', '53'], coords: [6.4648, 3.2838] }
  ];

  constructor(private http: HttpClient) {}
// Method to get buses for a given route (this is an example, adjust accordingly)
getBusesForRoute(from: string, to: string): Observable<string[]> {
  // Example data; you can replace this with your actual logic to fetch buses.
  const buses = {
    "1st Avenue-2nd Avenue": ["45", "N5"],
    "2nd Avenue-3rd Avenue": ["BRT", "22"],
    "3rd Avenue-4th Avenue": ["60", "B4"],
    "4th Avenue-5th Avenue": ["BRT", "11"],
    "5th Avenue-6th Avenue": ["27", "M1"],
  };
  
  const key = "1st Avenue-2nd Avenue"; // or any other key dynamically
  
  // Cast the key to one of the valid keys in the buses object
  return of(buses[key as keyof typeof buses] || []); // Return empty array if no buses found
}
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
    const routeDetails = {
      routeId: routeId,
      duration: '30 minutes',
      distance: '5 km',
      stops: this.busStops.slice(13, 20)
    };

    return of(routeDetails);
  }

  // Mocked method to get live traffic data
  getLiveTrafficData(routeId: string): Observable<any> {
    const trafficData = {
      status: 'Normal',
      delay: 0
    };

    return of(trafficData);
  }

  // Method to get coordinates for a specific location name
  getCoordinatesForLocation(locationName: string): Observable<[number, number]> {
    const stop = this.busStops.find(stop => stop.name.toLowerCase() === locationName.toLowerCase());
    if (stop) {
      return of(stop.coords as [number, number]);
    } else {
      console.error(`Location '${locationName}' not found in bus stop data.`);
      return of([0, 0]);
    }
  }

 // Method to get stops between two locations with custom short and long routes
 getStopsBetweenLocations(from: string, to: string, isShortRoute: boolean): Observable<string[]> {
  if (from === "1st Avenue" && to === "2nd Avenue") {
    const shortRouteStops = ["1st Avenue", "Main Street", "Central Park", "2nd Avenue"];
    const longRouteStops = ["1st Avenue", "Main Street", "North Plaza", "East Gate", "South Park", "2nd Avenue"];
    return of(isShortRoute ? shortRouteStops : longRouteStops);
  }

  if (from === "1st Avenue" && to === "3rd Avenue") {
    const shortRouteStops = ["1st Avenue", "Main Street", "Central Park", "3rd Avenue"];
    const longRouteStops = ["1st Avenue", "Main Street", "North Plaza", "East Gate", "South Park", "3rd Avenue"];
    return of(isShortRoute ? shortRouteStops : longRouteStops);
  }

  if (from === "1st Avenue" && to === "4th Avenue") {
    const shortRouteStops = ["1st Avenue", "Main Street", "Central Park", "Festival Mall", "4th Avenue"];
    const longRouteStops = ["1st Avenue", "Main Street", "North Plaza", "East Gate", "Festival Mall", "South Park", "4th Avenue"];
    return of(isShortRoute ? shortRouteStops : longRouteStops);
  }

  if (from === "1st Avenue" && to === "5th Avenue") {
    const shortRouteStops = ["1st Avenue", "Main Street", "Central Park", "Festival Mall", "5th Avenue"];
    const longRouteStops = ["1st Avenue", "Main Street", "North Plaza", "East Gate", "Festival Mall", "South Park", "5th Avenue"];
    return of(isShortRoute ? shortRouteStops : longRouteStops);
  }

  if (from === "1st Avenue" && to === "6th Avenue") {
    const shortRouteStops = ["1st Avenue", "Main Street", "Central Park", "Golden Tulip Festac", "6th Avenue"];
    const longRouteStops = ["1st Avenue", "Main Street", "North Plaza", "East Gate", "Festival Mall", "6th Avenue"];
    return of(isShortRoute ? shortRouteStops : longRouteStops);
  }

  if (from === "1st Avenue" && to === "7th Avenue") {
    const shortRouteStops = ["1st Avenue", "Main Street", "Central Park", "Festival Mall", "7th Avenue"];
    const longRouteStops = ["1st Avenue", "Main Street", "North Plaza", "East Gate", "Festival Mall", "7th Avenue"];
    return of(isShortRoute ? shortRouteStops : longRouteStops);
  }

  if (from === "1st Avenue" && to === "8th Avenue") {
    const shortRouteStops = ["1st Avenue", "Main Street", "Central Park", "Festival Mall", "8th Avenue"];
    const longRouteStops = ["1st Avenue", "Main Street", "North Plaza", "East Gate", "Festival Mall", "South Park", "8th Avenue"];
    return of(isShortRoute ? shortRouteStops : longRouteStops);
  }

  // Routes from "2nd Avenue"
  if (from === "2nd Avenue" && to === "3rd Avenue") {
    const shortRouteStops = ["2nd Avenue", "Central Park", "3rd Avenue"];
    const longRouteStops = ["2nd Avenue", "Main Street", "North Plaza", "South Park", "3rd Avenue"];
    return of(isShortRoute ? shortRouteStops : longRouteStops);
  }

  if (from === "2nd Avenue" && to === "4th Avenue") {
    const shortRouteStops = ["2nd Avenue", "Central Park", "3rd Avenue", "Festival Mall", "4th Avenue"];
    const longRouteStops = ["2nd Avenue", "Main Street", "North Plaza", "South Park", "Festival Mall", "4th Avenue"];
    return of(isShortRoute ? shortRouteStops : longRouteStops);
  }

  if (from === "2nd Avenue" && to === "5th Avenue") {
    const shortRouteStops = ["2nd Avenue", "Central Park", "Festival Mall", "5th Avenue"];
    const longRouteStops = ["2nd Avenue", "Main Street", "North Plaza", "East Gate", "Festival Mall", "5th Avenue"];
    return of(isShortRoute ? shortRouteStops : longRouteStops);
  }

  if (from === "2nd Avenue" && to === "6th Avenue") {
    const shortRouteStops = ["2nd Avenue", "Festival Mall", "6th Avenue"];
    const longRouteStops = ["2nd Avenue", "Main Street", "East Gate", "South Park", "Festival Mall", "6th Avenue"];
    return of(isShortRoute ? shortRouteStops : longRouteStops);
  }

  if (from === "2nd Avenue" && to === "7th Avenue") {
    const shortRouteStops = ["2nd Avenue", "Festival Mall", "7th Avenue"];
    const longRouteStops = ["2nd Avenue", "Main Street", "East Gate", "South Park", "Festival Mall", "7th Avenue"];
    return of(isShortRoute ? shortRouteStops : longRouteStops);
  }

  if (from === "2nd Avenue" && to === "8th Avenue") {
    const shortRouteStops = ["2nd Avenue", "Festival Mall", "8th Avenue"];
    const longRouteStops = ["2nd Avenue", "Main Street", "East Gate", "South Park", "Festival Mall", "8th Avenue"];
    return of(isShortRoute ? shortRouteStops : longRouteStops);
  }

  // Routes from "3rd Avenue"
  if (from === "3rd Avenue" && to === "4th Avenue") {
    const shortRouteStops = ["3rd Avenue", "Festival Mall", "4th Avenue"];
    const longRouteStops = ["3rd Avenue", "Main Street", "North Plaza", "South Park", "Festival Mall", "4th Avenue"];
    return of(isShortRoute ? shortRouteStops : longRouteStops);
  }

  if (from === "3rd Avenue" && to === "5th Avenue") {
    const shortRouteStops = ["3rd Avenue", "Festival Mall", "5th Avenue"];
    const longRouteStops = ["3rd Avenue", "Main Street", "East Gate", "South Park", "Festival Mall", "5th Avenue"];
    return of(isShortRoute ? shortRouteStops : longRouteStops);
  }

  if (from === "3rd Avenue" && to === "6th Avenue") {
    const shortRouteStops = ["3rd Avenue", "Festival Mall", "6th Avenue"];
    const longRouteStops = ["3rd Avenue", "Main Street", "East Gate", "South Park", "Festival Mall", "6th Avenue"];
    return of(isShortRoute ? shortRouteStops : longRouteStops);
  }

  if (from === "3rd Avenue" && to === "7th Avenue") {
    const shortRouteStops = ["3rd Avenue", "Festival Mall", "7th Avenue"];
    const longRouteStops = ["3rd Avenue", "Main Street", "East Gate", "South Park", "Festival Mall", "7th Avenue"];
    return of(isShortRoute ? shortRouteStops : longRouteStops);
  }

  if (from === "3rd Avenue" && to === "8th Avenue") {
    const shortRouteStops = ["3rd Avenue", "Festival Mall", "8th Avenue"];
    const longRouteStops = ["3rd Avenue", "Main Street", "East Gate", "South Park", "Festival Mall", "8th Avenue"];
    return of(isShortRoute ? shortRouteStops : longRouteStops);
  }

  // Routes from "4th Avenue"
  if (from === "4th Avenue" && to === "5th Avenue") {
    const shortRouteStops = ["4th Avenue", "Festival Mall", "5th Avenue"];
    const longRouteStops = ["4th Avenue", "Main Street", "East Gate", "South Park", "Festival Mall", "5th Avenue"];
    return of(isShortRoute ? shortRouteStops : longRouteStops);
  }

  if (from === "4th Avenue" && to === "6th Avenue") {
    const shortRouteStops = ["4th Avenue", "Festival Mall", "6th Avenue"];
    const longRouteStops = ["4th Avenue", "Main Street", "East Gate", "South Park", "Festival Mall", "6th Avenue"];
    return of(isShortRoute ? shortRouteStops : longRouteStops);
  }

  if (from === "4th Avenue" && to === "7th Avenue") {
    const shortRouteStops = ["4th Avenue", "Festival Mall", "7th Avenue"];
    const longRouteStops = ["4th Avenue", "Main Street", "East Gate", "South Park", "Festival Mall", "7th Avenue"];
    return of(isShortRoute ? shortRouteStops : longRouteStops);
  }

  if (from === "4th Avenue" && to === "8th Avenue") {
    const shortRouteStops = ["4th Avenue", "Festival Mall", "8th Avenue"];
    const longRouteStops = ["4th Avenue", "Main Street", "East Gate", "South Park", "Festival Mall", "8th Avenue"];
    return of(isShortRoute ? shortRouteStops : longRouteStops);
  }

  // Routes from "5th Avenue"
  if (from === "5th Avenue" && to === "6th Avenue") {
    const shortRouteStops = ["5th Avenue", "Festival Mall", "6th Avenue"];
    const longRouteStops = ["5th Avenue", "Main Street", "East Gate", "South Park", "Festival Mall", "6th Avenue"];
    return of(isShortRoute ? shortRouteStops : longRouteStops);
  }

  if (from === "5th Avenue" && to === "7th Avenue") {
    const shortRouteStops = ["5th Avenue", "Festival Mall", "7th Avenue"];
    const longRouteStops = ["5th Avenue", "Main Street", "East Gate", "South Park", "Festival Mall", "7th Avenue"];
    return of(isShortRoute ? shortRouteStops : longRouteStops);
  }

  if (from === "5th Avenue" && to === "8th Avenue") {
    const shortRouteStops = ["5th Avenue", "Festival Mall", "8th Avenue"];
    const longRouteStops = ["5th Avenue", "Main Street", "East Gate", "South Park", "Festival Mall", "8th Avenue"];
    return of(isShortRoute ? shortRouteStops : longRouteStops);
  }

  // Routes from "6th Avenue"
  if (from === "6th Avenue" && to === "7th Avenue") {
    const shortRouteStops = ["6th Avenue", "Festival Mall", "7th Avenue"];
    const longRouteStops = ["6th Avenue", "Main Street", "East Gate", "South Park", "Festival Mall", "7th Avenue"];
    return of(isShortRoute ? shortRouteStops : longRouteStops);
  }

  // Routes from "Festac First Gate"
  if (from === "Festac First Gate" && to === "Festac Second Gate") {
    const shortRouteStops = ["Festac First Gate", "Festac Second Gate"];
    const longRouteStops = ["Festac First Gate", "Festac Police Station", "Festac Second Gate"];
    return of(isShortRoute ? shortRouteStops : longRouteStops);
  }

  if (from === "Festac First Gate" && to === "Mile 2") {
    const shortRouteStops = ["Festac First Gate", "Apple Junction", "Mile 2"];
    const longRouteStops = ["Festac First Gate", "Festac Second Gate", "Festac Police Station", "Mile 2"];
    return of(isShortRoute ? shortRouteStops : longRouteStops);
  }

  // Routes from "Festac Second Gate"
  if (from === "Festac Second Gate" && to === "Mile 2") {
    const shortRouteStops = ["Festac Second Gate", "Apple Junction", "Mile 2"];
    const longRouteStops = ["Festac Second Gate", "Festac Police Station", "Agboju Market", "Mile 2"];
    return of(isShortRoute ? shortRouteStops : longRouteStops);
  }

  if (from === "Festac Second Gate" && to === "Agboju Market") {
    const shortRouteStops = ["Festac Second Gate", "Agboju Market"];
    const longRouteStops = ["Festac Second Gate", "Apple Junction", "Agboju Market"];
    return of(isShortRoute ? shortRouteStops : longRouteStops);
  }

  // Routes from "Apple Junction"
  if (from === "Apple Junction" && to === "Alakija") {
    const shortRouteStops = ["Apple Junction", "Agboju Market", "Alakija"];
    const longRouteStops = ["Apple Junction", "Festac Police Station", "Agboju Market", "Alakija"];
    return of(isShortRoute ? shortRouteStops : longRouteStops);
  }

  if (from === "Apple Junction" && to === "Satellite Town") {
    const shortRouteStops = ["Apple Junction", "Agboju Market", "Alakija", "Satellite Town"];
    const longRouteStops = ["Apple Junction", "Festac Police Station", "Agboju Market", "Alakija", "Satellite Town"];
    return of(isShortRoute ? shortRouteStops : longRouteStops);
  }

  if (from === "21 Road" && to === "Festac Police Station") {
    const shortRouteStops = ["21 Road", "23 Road", "Festac Police Station"];
    const longRouteStops = ["21 Road", "Festival Mall", "23 Road", "Festac Police Station"];
    return of(isShortRoute ? shortRouteStops : longRouteStops);
  }

  if (from === "7th Avenue" && to === "Golden Tulip Festac") {
    const shortRouteStops = ["7th Avenue", "Festival Mall", "Golden Tulip Festac"];
    const longRouteStops = ["7th Avenue", "Festival Mall", "23 Road", "Festac Police Station", "Golden Tulip Festac"];
    return of(isShortRoute ? shortRouteStops : longRouteStops);
  }

  if (from === "Abule Ado" && to === "Agboju Market") {
    const shortRouteStops = ["Abule Ado", "Satellite Town", "Agboju Market"];
    const longRouteStops = ["Abule Ado", "Ijegun", "Satellite Town", "Agboju Market"];
    return of(isShortRoute ? shortRouteStops : longRouteStops);
  }

  if (from === "Volks Bus Stop" && to === "Ojo Road") {
    const shortRouteStops = ["Volks Bus Stop", "Abule Osun", "Ojo Road"];
    const longRouteStops = ["Volks Bus Stop", "Mazamaza", "Alaba International", "Ojo Road"];
    return of(isShortRoute ? shortRouteStops : longRouteStops);
  }

  if (from === "Alaba International" && to === "Volks Bus Stop") {
    const shortRouteStops = ["Alaba International", "Volks Bus Stop"];
    const longRouteStops = ["Alaba International", "Ojo Road", "Volks Bus Stop"];
    return of(isShortRoute ? shortRouteStops : longRouteStops);
  }

  if (from === "Ijegun" && to === "Satellite Town") {
    const shortRouteStops = ["Ijegun", "Satellite Town"];
    const longRouteStops = ["Ijegun", "Abule Ado", "Satellite Town"];
    return of(isShortRoute ? shortRouteStops : longRouteStops);
  }

  if (from === "Festival Mall" && to === "23 Road") {
    const shortRouteStops = ["Festival Mall", "23 Road"];
    const longRouteStops = ["Festival Mall", "1st Avenue", "23 Road"];
    return of(isShortRoute ? shortRouteStops : longRouteStops);
  }

  if (from === "Agboju Market" && to === "Festac First Gate") {
    const shortRouteStops = ["Agboju Market", "Festac First Gate"];
    const longRouteStops = ["Agboju Market", "Mile 2", "Festac First Gate"];
    return of(isShortRoute ? shortRouteStops : longRouteStops);
  }

  if (from === "Mile 2" && to === "Apple Junction") {
    const shortRouteStops = ["Mile 2", "Apple Junction"];
    const longRouteStops = ["Mile 2", "Festac First Gate", "Apple Junction"];
    return of(isShortRoute ? shortRouteStops : longRouteStops);
  }

  if (from === "23 Road" && to === "1st Avenue") {
    const shortRouteStops = ["23 Road", "1st Avenue"];
    const longRouteStops = ["23 Road", "Festival Mall", "1st Avenue"];
    return of(isShortRoute ? shortRouteStops : longRouteStops);
  }

  if (from === "Alakija" && to === "Mazamaza") {
    const shortRouteStops = ["Alakija", "Mazamaza"];
    const longRouteStops = ["Alakija", "Agboju Market", "Mazamaza"];
    return of(isShortRoute ? shortRouteStops : longRouteStops);
  }

  if (from === "Amuwo Odofin" && to === "Alakija") {
    const shortRouteStops = ["Amuwo Odofin", "Alakija"];
    const longRouteStops = ["Amuwo Odofin", "Festac First Gate", "Alakija"];
    return of(isShortRoute ? shortRouteStops : longRouteStops);
  }

  if (from === "Ijegun" && to === "Amuwo Odofin") {
    const shortRouteStops = ["Ijegun", "Amuwo Odofin"];
    const longRouteStops = ["Ijegun", "Satellite Town", "Amuwo Odofin"];
    return of(isShortRoute ? shortRouteStops : longRouteStops);
  }

  if (from === "Festac Primary School" && to === "7th Avenue") {
    const shortRouteStops = ["Festac Primary School", "7th Avenue"];
    const longRouteStops = ["Festac Primary School", "Festival Mall", "7th Avenue"];
    return of(isShortRoute ? shortRouteStops : longRouteStops);
  }

  if (from === "Central Park" && to === "1st Avenue") {
    const shortRouteStops = ["Central Park", "1st Avenue"];
    const longRouteStops = ["Central Park", "East Gate", "1st Avenue"];
    return of(isShortRoute ? shortRouteStops : longRouteStops);
  }

  if (from === "Apple Junction" && to === "Ijegun") {
    const shortRouteStops = ["Apple Junction", "Ijegun"];
    const longRouteStops = ["Apple Junction", "Satellite Town", "Ijegun"];
    return of(isShortRoute ? shortRouteStops : longRouteStops);
  }
  if (from === "Main Street" && to === "Central Park") {
    const shortRouteStops = ["Main Street", "Central Park"];
    const longRouteStops = ["Main Street", "North Plaza", "East Gate", "Central Park"];
    return of(isShortRoute ? shortRouteStops : longRouteStops);
  }

  if (from === "Main Gate" && to === "Central Park") {
    const shortRouteStops = ["Main Gate", "Central Park"];
    const longRouteStops = ["Main Gate", "East Gate", "South Park", "Central Park"];
    return of(isShortRoute ? shortRouteStops : longRouteStops);
  }

  // Routes from "Mile 2"
  if (from === "Mile 2" && to === "Amuwo Odofin") {
    const shortRouteStops = ["Mile 2", "Apple Junction", "Amuwo Odofin"];
    const longRouteStops = ["Mile 2", "Agboju Market", "Apple Junction", "Amuwo Odofin"];
    return of(isShortRoute ? shortRouteStops : longRouteStops);
  }

  if (from === "Mile 2" && to === "Volks Bus Stop") {
    const shortRouteStops = ["Mile 2", "Alakija", "Volks Bus Stop"];
    const longRouteStops = ["Mile 2", "Agboju Market", "Alakija", "Volks Bus Stop"];
    return of(isShortRoute ?  shortRouteStops : longRouteStops);
  }

  return of([]); // Return empty observable if no match
}


  // Helper method to determine if a stop is between two coordinates
  private isStopBetween(fromCoords: [number, number], toCoords: [number, number], stopCoords: [number, number]): boolean {
    const [lat1, lon1] = fromCoords;
    const [lat2, lon2] = toCoords;
    const [stopLat, stopLon] = stopCoords;

    return (
      Math.min(lat1, lat2) <= stopLat && stopLat <= Math.max(lat1, lat2) &&
      Math.min(lon1, lon2) <= stopLon && stopLon <= Math.max(lon1, lon2)
    );
  }
}
