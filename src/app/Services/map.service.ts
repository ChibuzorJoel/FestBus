import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  

    // Sample bus stops data
    private busStops = [
      { name: 'Festac Bus Stop', buses: ['23', '45'], coords: [6.475, 3.295] },
      { name: 'Mile 2 Bus Stop', buses: ['78', '90'], coords: [6.474, 3.295] },
      { name: 'Abule Ado Bus Stop', buses: ['12', '34'], coords: [6.471, 3.290] },
      { name: 'Amuwo Odofin Bus Stop', buses: ['56', '78'], coords: [6.480, 3.290] },
      { name: 'Ikotun Bus Stop', buses: ['90', '34'], coords: [6.483, 3.285] },
    ];
  
    constructor() {}
  
    // Method to get all nearby bus stops
    getNearbyStops() {
      return this.busStops;
    }
  
    // Method to get the user's current location
    getUserLocation(successCallback: (position: GeolocationPosition) => void, errorCallback: (error: GeolocationPositionError) => void) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
      } else {
        errorCallback({ code: 1, message: 'Geolocation is not supported by your browser.', PERMISSION_DENIED: 1, POSITION_UNAVAILABLE: 2, TIMEOUT: 3 });
      }
    }

  getRouteDetails(routeId: string) {
    return {
      routeId: routeId,
      duration: '45 minutes',
      stops: [
        { name: 'Festac Town', coords: [6.465422, 3.306448] },
        { name: 'Mile 2', coords: [6.474, 3.295] },
        { name: 'Orile', coords: [6.488, 3.308] },
        { name: 'CMS', coords: [6.4531, 3.3958] }
      ]
    };
  }
}