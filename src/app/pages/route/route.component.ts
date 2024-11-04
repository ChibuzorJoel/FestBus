import { AfterViewInit, Component, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MapService } from 'src/app/Services/map.service';
import 'leaflet-routing-machine';
declare const L: any;

@Component({
  selector: 'app-route',
  templateUrl: './route.component.html',
  styleUrls: ['./route.component.css']
})
export class RouteComponent implements AfterViewInit {
  fromLocation: string = 'Festac Town';
  toLocation: string = 'Mile 2 Bus Stop';
  routeDuration: string = 'Loading...';
  routeDistance: string = 'Loading...';
  routeStops: any[] = []; // Array to hold stops with IDs
  routeInstructions: any[] = []; // Array to store each instruction
  map: any;
  loading: boolean = true;
  routeLayer: any;

  constructor(private route: ActivatedRoute, private mapService: MapService, private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.route.queryParams.subscribe(params => {
      this.fromLocation = params['from'] || this.fromLocation;
      this.toLocation = params['to'] || this.toLocation;
      this.getRouteCoordinates();
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
            this.loading = false;
          }
        });
      }
    });
  }

  initializeMap(fromCoords: [number, number], toCoords: [number, number]) {
    const festacCenter: [number, number] = [6.465422, 3.310377];

    if (this.map) {
      this.map.remove();
    }

    this.map = L.map('map').setView(fromCoords.length ? fromCoords : festacCenter, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 13,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);

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
      this.routeInstructions = routes[0].instructions; // Store the instructions here
      this.getStopsAlongRoute(fromCoords, toCoords);
    })
    .addTo(this.map);

    setTimeout(() => {
      this.map.invalidateSize();
    }, 500);
  }

  getStopsAlongRoute(fromCoords: [number, number], toCoords: [number, number]) {
    this.mapService.getStopsBetweenLocations(fromCoords, toCoords).subscribe({
      next: (stops: any[]) => {
        this.routeStops = stops.map(stop => ({
          id: stop.id, // Store the ID of the stop
          name: stop.name || stop,
          time: stop.time || 'N/A',
          arrival: stop.arrival || 'N/A',
          dropOff: stop.dropOff || 'N/A'
        }));
      }
    });
  }

  fetchRouteDetails(fromCoords: [number, number], toCoords: [number, number]) {
    this.mapService.getRouteDetails(`${this.fromLocation}-${this.toLocation}`).subscribe({
      next: (routeDetails) => {
        this.routeDuration = routeDetails.duration;
        this.routeDistance = routeDetails.distance;
      }
    });
  }
}
