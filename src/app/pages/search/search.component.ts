import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BusDataService } from 'src/app/Services/bus-data.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Observable, Subject, of } from 'rxjs';
import { BusStop } from 'src/app/model/bus-stop';
declare var bootstrap: any;

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  @ViewChild('journeyInfoSection') journeyInfoSection!: ElementRef;
  fromLocation: string = '';
  toLocation: string = '';
  searchHistory: string[] = [];
  journeyResults: any = null;
  filteredRoutes: any[] = [];
  filteredFromStops: BusStop[] = [];
  filteredToStops: BusStop[] = [];
  isLoading: boolean = false;
  validationError: string = '';
  searchForm: FormGroup;
  errorMessage: string | null = null;  // For storing error messages

  private searchSubject = new Subject<{ term: string, type: 'from' | 'to' }>();

  constructor(
    private fb: FormBuilder,
    private ngZone: NgZone,
    private busDataService: BusDataService,
    private router: Router
  ) {
    this.searchForm = this.fb.group({
      fromLocation: ['', Validators.required],
      toLocation: ['', Validators.required],
    });
  }

  ngOnInit() {
    // Subscribe to searchSubject to handle debounced search for both fields
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(({ term, type }) => {
        return term.length >= 3 ? this.busDataService.searchBusStops(term).pipe(
          switchMap((filteredStops: BusStop[]) => of({ filteredStops, type }))
        ) : of({ filteredStops: [], type });
      })
    ).subscribe(({ filteredStops, type }) => {
      // Update the correct list based on the 'type'
      if (type === 'from') {
        this.filteredFromStops = filteredStops;
      } else {
        this.filteredToStops = filteredStops;
      }
    });
  }

  // Trigger the search and display results when the search button is clicked
  onSearchButtonClick() {
    // Validate input locations
    if (!this.fromLocation || !this.toLocation) {
      this.validationError = 'Both locations must be filled in.';
      return;
    }
    if (this.fromLocation === this.toLocation) {
      this.validationError = 'From and To locations cannot be the same.';
      return;
    }

    // Check if entered locations are valid bus stops
    const isValidFrom = this.isValidBusStop(this.fromLocation);
    const isValidTo = this.isValidBusStop(this.toLocation);
    
    if (!isValidFrom) {
      this.validationError = `The location "${this.fromLocation}" is not a valid bus stop in Festac.`;
      return;
    }
    if (!isValidTo) {
      this.validationError = `The location "${this.toLocation}" is not a valid bus stop in Festac.`;
      return;
    }

    this.validationError = ''; // Clear previous error
    this.searchHistory.push(`From: ${this.fromLocation} To: ${this.toLocation}`);
    this.isLoading = true;
    this.searchRoutes();
  }

  // Check if a given location is a valid bus stop
  private isValidBusStop(location: string): boolean {
    return this.filteredFromStops.some(stop => stop.name.toLowerCase() === location.toLowerCase()) ||
           this.filteredToStops.some(stop => stop.name.toLowerCase() === location.toLowerCase()) ||
           this.busDataService.isValidBusStop(location); // Call the new method
  }

  openHistoryModal() {
    const modal = new bootstrap.Modal(document.getElementById('historyModal'));
    modal.show();
  }

  // Perform the route search and update the results
  searchRoutes() {
    const currentTime = new Date();
    const defaultDuration = 35;

    this.busDataService.searchRoutes(this.fromLocation, this.toLocation).subscribe(
      (routes: any[]) => {
        this.isLoading = false;
        if (routes && routes.length > 0) {
          this.filteredRoutes = routes;
          const firstRoute = routes[0];
          this.journeyResults = this.formatJourneyResults(firstRoute.duration, currentTime);
          this.scrollToJourneyInfo();
        } else {
          this.filteredRoutes = [];
          this.journeyResults = this.formatJourneyResults(defaultDuration, currentTime);
        }
      },
      (error) => {
        console.error('Error fetching routes:', error);
        this.isLoading = false;
        this.filteredRoutes = [];
      }
    );
  }

  // Format journey results
  formatJourneyResults(duration: number, currentTime: Date) {
    const dropOffTime = new Date(currentTime.getTime() + duration * 60000);
    return {
      arrivalTime: currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      dropOffTime: dropOffTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      formattedDuration: `Your journey will take approximately ${duration} minutes, arriving by ${dropOffTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`
    };
  }

  scrollToJourneyInfo() {
    if (this.journeyInfoSection) {
      this.journeyInfoSection.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Select a bus stop for "From" or "To" location
  selectStop(stopName: string, type: 'from' | 'to') {
    if (type === 'from') {
      this.fromLocation = stopName;
      this.filteredFromStops = [];
    } else {
      this.toLocation = stopName;
      this.filteredToStops = [];
    }
  }

  // Handle input for both "From" and "To" locations
  onLocationInput(type: 'from' | 'to') {
    const term = type === 'from' ? this.fromLocation : this.toLocation;
    this.searchSubject.next({ term, type });
  }

  // Clear the search results and reset the fields
  clearResults() {
    this.fromLocation = '';
    this.toLocation = '';
    this.journeyResults = null;
    this.filteredRoutes = [];
    this.filteredFromStops = [];
    this.filteredToStops = [];
    this.validationError = ''; // Clear error message on reset
  }

  // Navigate to the route page with journey details
  navigateToRoute() {
    if (this.journeyResults) {
      this.router.navigate(['/route'], {
        queryParams: {
          from: this.fromLocation,
          to: this.toLocation,
          arrivalTime: this.journeyResults.arrivalTime,
          dropOffTime: this.journeyResults.dropOffTime,
          duration: this.journeyResults.formattedDuration,
        },
      });
    }
  }

  // Delete a specific history item
  deleteHistoryItem(index: number) {
    if (index > -1 && index < this.searchHistory.length) {
      this.searchHistory.splice(index, 1); // Remove the item from history
    }
  }

  // Clear all history
  clearAllHistory() {
    this.searchHistory = []; // Clear the entire history
  }
}
