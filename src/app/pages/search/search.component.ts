import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BusDataService, BusStop } from 'src/app/Services/bus-data.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  fromLocation: string = '';
  toLocation: string = '';
  journeyResults: any = null;
  filteredRoutes: any[] = [];
  
  filteredFromStops: BusStop[] = [];  // Array for filtered 'from' stops
  filteredToStops: BusStop[] = [];    // Array for filtered 'to' stops
  
  private fromSearchSubject = new Subject<string>(); // Subject for 'from' location input changes
  private toSearchSubject = new Subject<string>();   // Subject for 'to' location input changes

  constructor(
    private ngZone: NgZone, 
    private busDataService: BusDataService,
    private router: Router
  ) {}

  ngOnInit() {
    // Observable for searching 'from' location
    this.fromSearchSubject.pipe(
      debounceTime(300),              // Wait for 300ms after typing stops
      distinctUntilChanged(),         // Avoid unnecessary requests if input doesn't change
      switchMap((searchTerm: string) => {
        // Fetch filtered bus stops for 'from' location when it has 3 or more characters
        if (this.fromLocation.length >= 3) {
          return this.busDataService.searchBusStops(this.fromLocation);
        } else {
          return this.busDataService.getAllBusStops();  // Return all stops if less than 3 characters
        }
      })
    ).subscribe((filteredStops: BusStop[]) => {
      this.filteredFromStops = filteredStops;  // Store filtered 'from' stops
    });

    // Observable for searching 'to' location
    this.toSearchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((searchTerm: string) => {
        if (this.toLocation.length >= 3) {
          return this.busDataService.searchBusStops(this.toLocation);
        } else {
          return this.busDataService.getAllBusStops();  // Return all stops if less than 3 characters
        }
      })
    ).subscribe((filteredStops: BusStop[]) => {
      this.filteredToStops = filteredStops;  // Store filtered 'to' stops
    });
  }

  // Method triggered when the "Search" button is clicked
  onSearchButtonClick() {
    if (!this.fromLocation || !this.toLocation) {
      return; // Don't search if locations are not provided
    }

    // Trigger the fetching of filtered bus stops for 'from' and 'to' locations
    this.getFilteredRoutes();

    // Trigger the route search
    this.searchRoutes();
  }

  // Method to trigger the search for routes
  searchRoutes() {
    const currentTime = new Date();
    const journeyDuration = 35; // Example: 35 minutes (this can be dynamic based on routes)
    const dropOffTime = new Date(currentTime.getTime() + journeyDuration * 60000);

    this.journeyResults = {
      arrivalTime: currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      dropOffTime: dropOffTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      formattedDuration: `Your journey will take approximately ${journeyDuration} minutes and you are expected to arrive by ${dropOffTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`
    };

    // Ensure this method filters routes based on `fromLocation` and `toLocation`
    this.busDataService.searchRoutes(this.fromLocation, this.toLocation).subscribe((routes: any[]) => {
      if (routes && routes.length > 0) {
        this.filteredRoutes = routes;  // Set the filtered routes
      } else {
        this.filteredRoutes = [];  // No results found, clear the array
      }
    }, (error) => {
      console.error('Error fetching routes:', error);
      this.filteredRoutes = [];  // Handle any errors by clearing the results
    });
  }

  // Method to handle the selection of a bus stop from the 'from' location suggestions
  selectFromStop(stopName: string) {
    this.fromLocation = stopName;
    this.filteredFromStops = [];  // Clear suggestions after selecting
    this.fromSearchSubject.next(this.fromLocation); // Trigger new search for 'from'
  }

  // Method to handle the selection of a bus stop from the 'to' location suggestions
  selectToStop(stopName: string) {
    this.toLocation = stopName;
    this.filteredToStops = [];  // Clear suggestions after selecting
    this.toSearchSubject.next(this.toLocation); // Trigger new search for 'to'
  }

  // Method to retrieve filtered bus stops based on the 'fromLocation' and 'toLocation' inputs
  getFilteredRoutes() {
    // Only fetch filtered bus stops if the inputs have 3 or more characters
    if (this.fromLocation.length >= 3) {
      this.busDataService.searchBusStops(this.fromLocation).subscribe((stops: BusStop[]) => {
        this.filteredFromStops = stops;  // Assign the filtered 'from' stops to the array
      });
    } else {
      this.busDataService.getAllBusStops().subscribe((stops: BusStop[]) => {
        this.filteredFromStops = stops;  // Fetch all stops if less than 3 characters
      });
    }

    if (this.toLocation.length >= 3) {
      this.busDataService.searchBusStops(this.toLocation).subscribe((stops: BusStop[]) => {
        this.filteredToStops = stops;  // Assign the filtered 'to' stops to the array
      });
    } else {
      this.busDataService.getAllBusStops().subscribe((stops: BusStop[]) => {
        this.filteredToStops = stops;  // Fetch all stops if less than 3 characters
      });
    }
  }
}