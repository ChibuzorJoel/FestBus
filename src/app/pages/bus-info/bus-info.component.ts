import { Component, OnInit } from '@angular/core';
import { BusDataService } from 'src/app/Services/bus-data.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-bus-info',
  templateUrl: './bus-info.component.html',
  styleUrls: ['./bus-info.component.css']
})
export class BusInfoComponent implements OnInit {
  busNumber: string = '';
  filteredBusStops: any[] = [];
  private searchSubject = new Subject<string>();
  isLoading: boolean = false;

  constructor(private busDataService: BusDataService) {}

  ngOnInit() {
    // Handle input field events for bus number search
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((searchTerm: string) => {
        if (this.busNumber.length >= 1) {
          return this.busDataService.searchBusNumbers(this.busNumber);
        } else {
          return [];
        }
      })
    ).subscribe((busStops: any[]) => {
      this.filteredBusStops = busStops;
      this.isLoading = false;
    });
  }

  // Trigger search when user types in the bus number field
  onBusNumberInput() {
    if (this.busNumber.length >= 1) {
      this.isLoading = true;
      this.searchSubject.next(this.busNumber);
    } else {
      this.filteredBusStops = [];
    }
  }

  // Clear search results
  clearResults() {
    this.busNumber = '';
    this.filteredBusStops = [];
  }
}
