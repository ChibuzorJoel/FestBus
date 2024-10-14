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
  
  private searchSubject = new Subject<string>(); // Subject for input changes

  constructor(
    private ngZone: NgZone, 
    private busDataService: BusDataService,
    private router: Router
  ) {}

  ngOnInit() {
    // Initializing search logic for "from" and "to" stops
    this.searchSubject.pipe(
      debounceTime(300),              // Wait for 300ms after typing stops
      distinctUntilChanged(),         // Avoid unnecessary requests if input doesn't change
      switchMap((searchTerm: string) => {
        // Fetch filtered bus stops for 'from' and 'to' fields when they are typed
        if (this.fromLocation.length >= 3) {
          return this.busDataService.searchBusStops(this.fromLocation); // Fetch filtered from stops
        } else {
          return []; // Return empty array if less than 3 characters are typed
        }
      })
    ).subscribe((filteredStops: BusStop[]) => {
      this.filteredFromStops = filteredStops;  // Store filtered from stops
    });

    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((searchTerm: string) => {
        if (this.toLocation.length >= 3) {
          return this.busDataService.searchBusStops(this.toLocation); // Fetch filtered to stops
        } else {
          return [];
        }
      })
    ).subscribe((filteredStops: BusStop[]) => {
      this.filteredToStops = filteredStops;  // Store filtered to stops
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
  }

  // Method to handle the selection of a bus stop from the 'to' location suggestions
  selectToStop(stopName: string) {
    this.toLocation = stopName;
    this.filteredToStops = [];  // Clear suggestions after selecting
  }

  // Method to handle input for 'fromLocation'
  onFromLocationInput() {
    if (this.fromLocation.length >= 3) {
      this.busDataService.searchBusStops(this.fromLocation).subscribe((stops: BusStop[]) => {
        this.filteredFromStops = stops;  // Set the filtered 'from' stops
      });
    } else {
      this.filteredFromStops = [];  // Clear filtered stops if less than 3 characters
    }
  }

  // Method to handle input for 'toLocation'
  onToLocationInput() {
    if (this.toLocation.length >= 3) {
      this.busDataService.searchBusStops(this.toLocation).subscribe((stops: BusStop[]) => {
        this.filteredToStops = stops;  // Set the filtered 'to' stops
      });
    } else {
      this.filteredToStops = [];  // Clear filtered stops if less than 3 characters
    }
  }

  // Method to retrieve filtered bus stops based on the 'fromLocation' and 'toLocation' inputs
  getFilteredRoutes() {
    // Only fetch filtered bus stops if the inputs have 3 or more characters
    if (this.fromLocation.length >= 3) {
      this.busDataService.searchBusStops(this.fromLocation).subscribe((stops: BusStop[]) => {
        this.filteredFromStops = stops;  // Assign the filtered 'from' stops to the array
      });
    }

    if (this.toLocation.length >= 3) {
      this.busDataService.searchBusStops(this.toLocation).subscribe((stops: BusStop[]) => {
        this.filteredToStops = stops;  // Assign the filtered 'to' stops to the array
      });
    }
  }
}