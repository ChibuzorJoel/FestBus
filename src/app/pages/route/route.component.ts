import { AfterViewInit, Component, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { MapService } from 'src/app/Services/map.service';
import 'leaflet-routing-machine';
declare const L: any;

@Component({
  selector: 'app-route',
  templateUrl: './route.component.html',
  styleUrls: ['./route.component.css']
})
export class RouteComponent implements AfterViewInit {
  fromLocation: string = 'Loading';
  toLocation: string = 'Loading';
  routeDuration: string = 'Loading...';
  routeDistance: string = 'Loading...';
  routeStops: any[] = [];
  routeInstructions: any[] = [];
  map: any;
  loading: boolean = true;
  routeLayer: any;

  shorterRouteStops: any[] = [];
  longerRouteStops: any[] = [];
  
  // Declare buses for each route section
  busNumbers: string[] = [];
  busRoutes: { busNumber: string }[] = [];

  constructor(
    private route: ActivatedRoute,
    private mapService: MapService,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
    private router: Router
  ) {}

  ngAfterViewInit(): void {
    this.route.queryParams.subscribe(params => {
      this.fromLocation = params['from'] || this.fromLocation;
      this.toLocation = params['to'] || this.toLocation;
      this.getRouteCoordinates();
    });
  }
  scrollToTop() {
    this.renderer.selectRootElement('#top').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  onStopClick(from: string, to: string) {
    // Set query parameters and navigate to the route page
    this.router.navigate(['/route'], { queryParams: { from, to } }).then(() => {
      // Scroll to top after navigating
      this.scrollToTop();
    });
  }
  getRouteCoordinates() {
    const fromCoords$ = this.mapService.getCoordinatesForLocation(this.fromLocation);
    const toCoords$ = this.mapService.getCoordinatesForLocation(this.toLocation);

    fromCoords$.subscribe({
      next: (fromCoords) => {
        toCoords$.subscribe({
          next: (toCoords) => {
            this.initializeMap(fromCoords, toCoords);
            this.fetchRouteDetails(fromCoords, toCoords);
            this.getBusesForRoute(fromCoords, toCoords); // Get bus numbers here
            this.loading = false;
          },
          error: () => this.loading = false
        });
      },
      error: () => this.loading = false
    });
  }

  getBusesForRoute(fromCoords: [number, number], toCoords: [number, number]) {
    this.mapService.getBusesForRoute(this.fromLocation, this.toLocation).subscribe({
      next: (buses: string[]) => {
        this.busRoutes = buses.map(bus => ({
          busNumber: bus,
        }));
        this.busNumbers = buses; // Update bus numbers for dynamic change
      },
      error: () => {
        console.log('Failed to fetch bus numbers');
      }
    });
  }

  initializeMap(fromCoords: [number, number], toCoords: [number, number]) {
    const festacCenter: [number, number] = [6.465422, 3.310377];

    if (this.map) {
      this.map.remove();
    }

    const initialCoords = fromCoords.length ? fromCoords : festacCenter;
    this.map = L.map('map').setView(initialCoords, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 16,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);

    if (fromCoords.length && toCoords.length) {
      L.marker(fromCoords).addTo(this.map).bindPopup(`<b>Start:</b> ${this.fromLocation}`).openPopup();
      L.marker(toCoords).addTo(this.map).bindPopup(`<b>Destination:</b> ${this.toLocation}`);

      if (this.routeLayer) {
        this.routeLayer.remove();
      }
      this.routeLayer = L.polyline([fromCoords, toCoords], { color: 'blue', weight: 5, opacity: 0.7 }).addTo(this.map);

      L.Routing.control({
        waypoints: [
          L.latLng(fromCoords[0], fromCoords[1]),
          L.latLng(toCoords[0], toCoords[1])
        ],
        routeWhileDragging: true,
        show: true,
        createMarker: () => null,
      })
      .on('routesfound', (e: any) => {
        const routes = e.routes;
        const summary = routes[0].summary;
        this.routeDuration = `${Math.round(summary.totalTime / 60)} min`;
        this.routeDistance = `${(summary.totalDistance / 1000).toFixed(2)} km`;
        this.routeInstructions = routes[0].instructions;

        // Determine if the route is short or long and pass the appropriate value to the method
        const isShortRoute = true;  // You can set this dynamically based on your logic
        this.getStopsAlongRoute(fromCoords, toCoords, isShortRoute);
      })
      .addTo(this.map);
    }

    setTimeout(() => {
      this.map.invalidateSize();
    }, 500);
  }

  getStopsAlongRoute(fromCoords: [number, number], toCoords: [number, number], isShortRoute: boolean) {
    this.mapService.getStopsBetweenLocations(this.fromLocation, this.toLocation, isShortRoute).subscribe({
      next: (stops: any[]) => {
        this.routeStops = stops.map(stop => ({
          id: stop.id,
          name: stop.name || stop,
          time: stop.time || 'N/A',
          arrival: stop.arrival || 'N/A',
          dropOff: stop.dropOff || 'N/A'
        }));

        // Split into shorter and longer route stops
        const midIndex = Math.ceil(this.routeStops.length / 1);
        this.shorterRouteStops = this.routeStops.slice(0, midIndex);
        this.longerRouteStops = this.routeStops;
      },
      error: () => console.log('Failed to fetch stops')
    });
  }

  fetchRouteDetails(fromCoords: [number, number], toCoords: [number, number]) {
    this.mapService.getRouteDetails(`${this.fromLocation}-${this.toLocation}`).subscribe({
      next: (routeDetails) => {
        this.routeDuration = routeDetails.duration;
        this.routeDistance = routeDetails.distance;
      },
      error: () => console.log('Failed to fetch route details')
    });
  }
}
