import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { ActivatedRoute } from '@angular/router';
import { MapService } from 'src/app/Services/map.service'; // Import the MapService

@Component({
  selector: 'app-route',
  templateUrl: './route.component.html',
  styleUrls: ['./route.component.css']
})
export class RouteComponent implements OnInit {
  map: any;
  routeDetails: any;
  routeId: string = '';
  routeDuration: string = '';
  routeStops: any[] = [];

  constructor(private mapService: MapService, private route: ActivatedRoute) { }
  ngOnInit(): void {
    // Retrieve the route ID from the URL (e.g., /route/:id)
    this.routeId = this.route.snapshot.paramMap.get('id') || '';

    // Fetch route details using the service
    this.routeDetails = this.mapService.getRouteDetails(this.routeId);
    this.routeDuration = this.routeDetails.duration;
    this.routeStops = this.routeDetails.stops;

    // Initialize the map and show the route
    this.initMap();
    this.displayRouteOnMap();
  }

  private initMap(): void {
    // Initialize the map centered on the first stop of the route
    this.map = L.map('routeMap', {
      center: this.routeStops[0].coords,
      zoom: 13
    });

    // Add the tile layer (map background)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
  }

  private displayRouteOnMap(): void {
    // Plot each stop along the route on the map
    this.routeStops.forEach((stop, index) => {
      const marker = L.marker(stop.coords).addTo(this.map);
      marker.bindPopup(`<b>Stop ${index + 1}:</b> ${stop.name}`).openPopup();
    });

    // Optionally, draw a line connecting the stops
    const routeCoords = this.routeStops.map(stop => stop.coords);
    L.polyline(routeCoords, { color: 'blue' }).addTo(this.map);
  }
}

