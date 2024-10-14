


import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { Router } from '@angular/router';
import 'leaflet-control-geocoder';
import { MapService } from 'src/app/Services/map.service';  // Import the MapService

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  map: any;
  userMarker: any;
  userCircle: any;
  nearbyStops: any[] = [];
  currentBusStop: any;

  constructor(private router: Router, private mapService: MapService) { }

  ngOnInit(): void {
    this.initMap();
    this.loadNearbyBusStops();
    this.locateUser();
    this.initMap();
      // Initialize the map
      this.map = L.map('map').setView([6.465422, 3.306448], 14); 
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [6.465422, 3.306448],  // Festac Town coordinates
      zoom: 14
    });
    var marker = L.marker([6.4717837, 3.2855813]).addTo(this.map);
       // Add the tile layer (map background)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
  }

  private loadNearbyBusStops(): void {
    // Fetch nearby bus stops from the MapService
    this.nearbyStops = this.mapService.getNearbyStops();
  }

  private locateUser(): void {
    const customIcon = L.icon({
      iconUrl: 'assets/arrow-icon.png',
      iconSize: [38, 38],
      iconAnchor: [22, 22],
      popupAnchor: [0, -16]
    });

    this.mapService.getUserLocation(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        // Add a marker at the user's location
        this.userMarker = L.marker([lat, lng], { icon: customIcon })
          .addTo(this.map)
          .bindPopup(`Your location:<br>Latitude: ${lat.toFixed(6)}<br>Longitude: ${lng.toFixed(6)}`)
          .openPopup();

        // Set a circle around the user's location
        this.userCircle = L.circle([6.4717837, 3.2855813], {
          color: 'blue',
          fillColor: '#30f',
          fillOpacity: 0.2,
          radius: 500
        }).addTo(this.map);

        // Center the map on the user's location
        this.map.setView([6.4717837, 3.2855813], 14);

        // Set the current bus stop based on the user's location
        this.currentBusStop = {
          name: 'Your Current Location',
          buses: ['Bus 1', 'Bus 2'] // Placeholder, can be replaced with actual data
        };
      },
      (error) => {
        alert('Unable to retrieve your location.');
      }
    );
  }

  search(event: any): void {
    const query = event.target.value;
    if (query.length >= 3) {
      this.router.navigate(['/search']);  // Navigate to the search page
    }
  }
}