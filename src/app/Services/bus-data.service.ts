import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { BusStop } from '../model/bus-stop';
import { Route } from '../model/route';

@Injectable({
  providedIn: 'root'
})
export class BusDataService {

  private localBusStops: BusStop[] = [
    { id: 1, name: '1st Avenue', avenue: '1st Avenue', lat: 6.469970, lng: 3.296110, buses: ['29', '45'] },
    { id: 2, name: '2nd Avenue', avenue: '2nd Avenue', lat: 6.462120, lng: 3.285890, buses: ['12', '22'] },
    { id: 3, name: '23rd Close', avenue: '2nd Avenue', lat: 6.4690, lng: 3.3310, buses: ['34', '56'] },
    { id: 4, name: '41st Road', avenue: '2nd Avenue', lat: 6.4715, lng: 3.3340, buses: ['23', '45'] },
    { id: 5, name: '3rd Avenue', avenue: '3rd Avenue', lat: 6.468300, lng: 3.298700, buses: ['11', '33'] },
    { id: 6, name: '4th Avenue', avenue: '4th Avenue', lat: 6.468600, lng: 3.300500, buses: ['25', '47'] },
    { id: 7, name: '5th Avenue', avenue: '5th Avenue', lat: 6.4695, lng: 3.3292, buses: ['18', '38'] },
    { id: 8, name: '6th Avenue', avenue: '6th Avenue', lat: 6.4702, lng: 3.3269, buses: ['9', '27'] },
    { id: 9, name: '24th Close', avenue: '6th Avenue', lat: 6.4701, lng: 3.3277, buses: ['22', '58'] },
    { id: 10, name: '12th Road', avenue: '7th Avenue', lat: 6.4665, lng: 3.3321, buses: ['30', '52'] },
    { id: 11, name: '7th Avenue', avenue: '7th Avenue', lat: 6.466445, lng: 3.283514, buses: ['20', '50'] },
    { id: 12, name: '15th Road', avenue: '7th Avenue', lat: 6.4661, lng: 3.3325, buses: ['44', '59'] },
    { id: 13, name: '11th Road', avenue: '7th Avenue', lat: 6.4670, lng: 3.3332, buses: ['13', '36'] },
    { id: 14, name: '7th Close', avenue: '6th Avenue', lat: 6.4708, lng: 3.3304, buses: ['17', '48'] },
    { id: 15, name: '10th Close', avenue: '7th Avenue', lat: 6.4688, lng: 3.3288, buses: ['19', '53'] },
    { id: 16, name: 'Festac Link Road', avenue: 'Festac Link', lat: 6.4650, lng: 3.3130, buses: ['10', '40'] },
    { id: 17, name: 'Festac Phase 1', avenue: 'Phase 1', lat: 6.4660, lng: 3.3005, buses: ['27', '51'] },
    { id: 18, name: 'Festac Phase 2', avenue: 'Phase 2', lat: 6.4675, lng: 3.3050, buses: ['32', '60'] },
    { id: 19, name: 'Road 7', avenue: 'Road 7', lat: 6.4680, lng: 3.3070, buses: ['16', '29'] },
    { id: 20, name: 'Road 4', avenue: 'Road 4', lat: 6.4655, lng: 3.3065, buses: ['14', '35'] },
    { id: 21, name: 'Road 5', avenue: 'Road 5', lat: 6.4665, lng: 3.3020, buses: ['15', '33'] },
    { id: 22, name: 'Road 3', avenue: 'Road 3', lat: 6.4645, lng: 3.3050, buses: ['37', '24'] },
    { id: 23, name: 'Road 2', avenue: 'Road 2', lat: 6.4630, lng: 3.2990, buses: ['50', '11'] }
  ];
  
  

  private routes: Route[] = [
    {
      departureTime: '00:26',
      arrivalTime: '01:15',
      duration: 49,
      leaveIn: 15,
      buses: ['29', 'N11'],
      stops: [] // Populate with actual Stop objects if available
    },
    {
      departureTime: '00:29',
      arrivalTime: '01:22',
      duration: 54,
      leaveIn: 17,
      buses: ['7', 'N22'],
      stops: [] // Populate as needed
    },
    {
      departureTime: '01:06',
      arrivalTime: '01:45',
      duration: 39,
      leaveIn: 54,
      buses: ['R7', 'N31', 'N16'],
      stops: [] // Populate as needed
    },
    {
      departureTime: '01:40',
      arrivalTime: '02:15',
      duration: 35,
      leaveIn: 6,
      buses: ['N3', 'N11'],
      stops: [] // Populate as needed
    }
  ];

  // Cache for loaded bus stops to reduce API calls
  private cachedBusStops: BusStop[] | null = null;
  

  constructor(private http: HttpClient) {}

  /**
   * Fetch available routes.
   */
  getRoutes(): Observable<Route[]> {
    return of(this.routes); // Return static routes or fetch from an API if needed
  }

  /**
   * Search bus stops by name or avenue.
   * @param query The search query.
   * @returns Observable of filtered bus stops.
   */
  searchBusStops(query: string): Observable<BusStop[]> {
    if (!query) {
      return of([]); // Return empty array if no query is provided
    }

    const filteredStops = this.localBusStops.filter(stop => 
      stop.name.toLowerCase().includes(query.toLowerCase()) || 
      stop.avenue.toLowerCase().includes(query.toLowerCase())
    );

    return of(filteredStops);
  }

  /**
   * Check if a given location is a valid bus stop.
   * @param location The location to check.
   * @returns boolean indicating if the location is valid.
   */
  isValidBusStop(location: string): boolean {
    return this.localBusStops.some(stop => stop.name.toLowerCase() === location.toLowerCase());
  }

  /**
   * Search for routes based on fromLocation and toLocation.
   * @param fromLocation Starting location.
   * @param toLocation Destination.
   * @returns Observable of filtered routes.
   */
  searchRoutes(fromLocation: string, toLocation: string): Observable<Route[]> {
    if (!fromLocation || !toLocation) {
      return of([]); // Return empty array if any location is missing
    }

    // For simplicity, let's assume the routes can be filtered based on bus numbers.
    return of(this.routes.filter(route => 
      route.buses.some(bus => 
        bus.toLowerCase().includes(fromLocation.toLowerCase()) || 
        bus.toLowerCase().includes(toLocation.toLowerCase())
      )
    ));
  }

  /**
   * Fetch all bus stops from a remote API.
   * If bus stops are already cached, return from cache.
   * @returns Observable of bus stops.
   */
  getAllBusStops(): Observable<BusStop[]> {
    if (this.cachedBusStops) {
      return of(this.cachedBusStops); // Return cached data if available
    }

    return this.http.get<BusStop[]>('your-api-endpoint-to-get-all-bus-stops')
      .pipe(
        map(stops => {
          this.cachedBusStops = stops;  // Cache the results
          return stops;
        }),
        catchError(this.handleError)  // Handle HTTP errors
      );
  }

  /**
   * Search for bus numbers.
   * @param busNumber The bus number to search for.
   * @returns Observable of filtered bus stops.
   */
  searchBusNumbers(busNumber: string): Observable<BusStop[]> {
    const filteredStops = this.localBusStops.filter((stop: BusStop) => 
      stop.buses.some((bus: string) => bus.startsWith(busNumber))
    );
    return of(filteredStops);
  }

  /**
   * Fetch real-time bus positions and merge with static data.
   * This method combines live bus positions with static bus stop data.
   * @returns Observable of updated bus stop data.
   */
  getRealTimeBusData(): Observable<BusStop[]> {
    return this.http.get<BusStop[]>('your-real-time-bus-data-endpoint')
      .pipe(
        map(realTimeData => {
          // Merge real-time data with local static data
          const updatedStops = this.localBusStops.map(stop => {
            const realTimeStop = realTimeData.find(rtStop => rtStop.name === stop.name);
            return realTimeStop ? { ...stop, ...realTimeStop } : stop;
          });
          return updatedStops;
        }),
        catchError(this.handleError)
      );
  }
  getBusNumbersForRoutes(fromLocation: string, toLocation: string): Observable<{ shortRouteBuses: string[], longRouteBuses: string[] }> {
    if (!fromLocation || !toLocation) {
      return of({ shortRouteBuses: [], longRouteBuses: [] }); // Return empty if no location is provided
    }

    const shortRouteBuses = this.localBusStops.filter(stop =>
      stop.name.toLowerCase() === fromLocation.toLowerCase() &&
      stop.buses.some(bus => bus === '29') // Example: Assume '29' follows a shorter route
    ).map(stop => stop.buses).flat();

    const longRouteBuses = this.localBusStops.filter(stop =>
      stop.name.toLowerCase() === fromLocation.toLowerCase() &&
      stop.buses.some(bus => bus === '45') // Example: Assume '45' follows a longer route
    ).map(stop => stop.buses).flat();

    return of({ shortRouteBuses, longRouteBuses });
  }

  /**
   * Error handling method for HTTP requests.
   * @param error The HTTP error response.
   * @returns Observable that throws an error.
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Unknown error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Server returned code: ${error.status}, message: ${error.message}`;
    }
    console.error(errorMessage);  // Log the error to the console (or a logging service)
    return throwError(errorMessage);  // Return an observable error
  }

  /**
   * Example method to demonstrate usage of subscription in the service itself.
   * This should normally be done in the component, but this is for demonstration.
   */
  loadBusStops(): void {
    this.getAllBusStops().subscribe(
      (stops) => {
        this.localBusStops = stops;
        console.log('Bus stops loaded:', stops);
      },
      (error) => {
        console.error('Failed to load bus stops:', error);
      }
    );
  }
}
