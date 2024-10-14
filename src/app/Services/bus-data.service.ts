import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';  
import { map } from 'rxjs/operators';


export interface BusStop {
  name: string;
  avenue: string;
  lat: number;
  lng: number;
}

@Injectable({
  providedIn: 'root'
})
export class BusDataService {

  private busStops: BusStop[] = [
    { name: '1st Avenue', avenue: '1st Avenue', lat: 6.4667, lng: 3.3250 },
    { name: '2nd Avenue', avenue: '2nd Avenue', lat: 6.4680, lng: 3.3275 },
    { name: '23rd Close', avenue: '2nd Avenue', lat: 6.4690, lng: 3.3310 },
    { name: '41st Road', avenue: '2nd Avenue', lat: 6.4715, lng: 3.3340 },
    { name: '3rd Avenue', avenue: '3rd Avenue', lat: 6.4672, lng: 3.3281 },
    { name: '4th Avenue', avenue: '4th Avenue', lat: 6.4660, lng: 3.3295 },
    { name: '5th Avenue', avenue: '5th Avenue', lat: 6.4695, lng: 3.3292 },
    { name: '6th Avenue', avenue: '6th Avenue', lat: 6.4702, lng: 3.3269 },
    { name: '24th Close', avenue: '6th Avenue', lat: 6.4701, lng: 3.3277 },
    { name: '12th Road', avenue: '7th Avenue', lat: 6.4665, lng: 3.3321 },
    { name: '7th Avenue', avenue: '7th Avenue', lat: 6.4700, lng: 3.3300 },
    { name: '15th Road', avenue: '7th Avenue', lat: 6.4661, lng: 3.3325 },
    { name: '11th Road', avenue: '7th Avenue', lat: 6.4670, lng: 3.3332 },
    { name: '8th Avenue', avenue: '8th Avenue', lat: 6.4708, lng: 3.3304 },
    { name: '10th Avenue', avenue: '10th Avenue', lat: 6.4688, lng: 3.3288 }
  ];

  private routes = [
    {
      departureTime: '00:26',
      arrivalTime: '01:15',
      duration: 49,
      leaveIn: 15,
      buses: ['29', 'N11']
    },
    {
      departureTime: '00:29',
      arrivalTime: '01:22',
      duration: 54,
      leaveIn: 17,
      buses: ['7', 'N22']
    },
    {
      departureTime: '01:06',
      arrivalTime: '01:45',
      duration: 39,
      leaveIn: 54,
      buses: ['R7', 'N31', 'N16']
    },
    {
      departureTime: '01:40',
      arrivalTime: '02:15',
      duration: 35,
      leaveIn: 6,
      buses: ['N3', 'N11']
    }
  ];

  constructor(private http: HttpClient) {}

  // Fetch available routes
  getRoutes() {
    return of(this.routes);
  }

  // Search bus stops by name or avenue (returns observable with filtered results)
  searchBusStops(query: string): Observable<BusStop[]> {
    if (!query) {
      return of([]); // Return empty array if no query is provided
    }

    const filteredStops = this.busStops.filter(stop => 
      stop.name.toLowerCase().includes(query.toLowerCase()) || 
      stop.avenue.toLowerCase().includes(query.toLowerCase())
    );

    return of(filteredStops);
  }

  // Fetch available routes based on the fromLocation and toLocation
  searchRoutes(fromLocation: string, toLocation: string): Observable<any[]> {
    if (!fromLocation || !toLocation) {
      return of([]); // Return empty array if any location is missing
    }

    // Here you could filter the routes based on certain logic
    // For now, just returning the list of all routes as an example
    return of(this.routes.filter(route => {
      // Example logic: filter routes where departure or arrival matches the location
      return route.buses.some(bus => bus.toLowerCase().includes(fromLocation.toLowerCase()) || bus.toLowerCase().includes(toLocation.toLowerCase()));
    }));
  }
  getAllBusStops(): Observable<BusStop[]> {
    return this.http.get<BusStop[]>('your-api-endpoint-to-get-all-bus-stops');
  }
}