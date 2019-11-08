import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Subscription, of } from 'rxjs';
import { first, delay } from 'rxjs/operators';

// import { User } from '../_models';
import { UserService, AuthService } from '../_services';
import { tileLayer, latLng, marker, LatLng, Layer, icon, Map } from 'leaflet';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    // User data
    currentUser: any;
    currentUserSubscription: Subscription;
    users = [];

    // Car Array
    cars = [];

    // Marker Array
    markers = [
        [51.765657, 6.3735596, 'KLE-HM-01'],
        [51.695657, 6.4735596, 'KLE-HM-02'],
        [51.615657, 6.5735596, 'KLE-HM-03'],
        [51.645657, 6.6735596, 'KLE-HM-04'],
        [51.635657, 6.7735596, 'KLE-HM-05']
    ];

    // Leaflet bindings
    map: Map;
    mapAttribution = 'GPS Tracker';
    mapMaxZoom = 18;
    markerZoom = 20;
    zoom = 13;
    uedem = latLng(51.665657, 6.2735596); // Uedem
    center = this.uedem; // Uedem

    // Leaflet custom layer array for marker object array
    layers: Layer[] = [];

    // Leaflet startup
    optionBindings: any = {
        layers: [{ url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', attribution: this.mapAttribution }],
        zoom: this.zoom,
        center: [ this.center ]
    };

    // Leaflet options

    options = {
        layers: [
            tileLayer(this.optionBindings.layers[0].url, { attribution: this.optionBindings.layers[0].attribution })
        ],
        zoom: this.optionBindings.zoom,
        center: latLng(this.optionBindings.center)
    };

    // Leaflet Layer for changing map provider

    layersControl = {
        baseLayers: {
            'Open Street Map': tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            { maxZoom: this.mapMaxZoom, attribution: this.mapAttribution}),
            'Wikimedia Maps': tileLayer('http://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png',
            { maxZoom: this.mapMaxZoom, attribution: this.mapAttribution})
        },
    };

    // Constructor

    constructor(
        private authenticationService: AuthService,
        private userService: UserService,
        private zone: NgZone
    ) {
        this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
            this.currentUser = user;
        });
    }

    // ng functions

    ngOnInit() {
        // this.loadAllUsers();
        this.loadMarkers();
        this.loadCars();
    }

    // tslint:disable-next-line: use-lifecycle-interface
    ngOnDestroy() {
        // unsubscribe to ensure no memory leaks
        this.currentUserSubscription.unsubscribe();
    }

    // Custom functions

    customView() {
        // Added zone because leaflet map is changed and async to use delay
            this.zone.run(async () => {
                this.map.panTo(this.uedem);

                await delay(1000);

                this.map.setZoom(this.zoom);
            });
    }

    loadCars() {
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < this.markers.length; i++) {
            const carName = String(this.markers[i][2]);

            this.cars.push(carName);
        }
    }

    loadMarkers() {
        // Loop through the markers array
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < this.markers.length; i++  ) {
            const lon = Number(this.markers[i][0]);
            const lat = Number(this.markers[i][1]);
            const popupText = String(this.markers[i][2]);

            const markerLocation = latLng([lon, lat]);
            const mark = markerLocation;

            // Set marker
            const newMarker = marker(mark,
            {
                // Icon opt
                icon: icon({
                    iconSize: [ 25, 41 ],
                    iconAnchor: [ 13, 41 ],
                    iconUrl: 'leaflet/marker-icon.png',
                    shadowUrl: 'leaflet/marker-shadow.png'
                }),
                riseOnHover: true
            }).on('click', () => {
                this.zone.run(() => {
                    // zoom
                    // console.log('zoom working');
                    this.applyChange(markerLocation);
                });
            });

            // Add Popup to Marker
            newMarker.bindPopup(popupText);

            // Mouseover func
            newMarker.on('mouseover', () => {
                this.zone.run(() => {
                    newMarker.openPopup();
                });
                // newMarker.openPopup();
            });
            newMarker.on('mouseout', () => {
                this.zone.run(() => {
                    newMarker.closePopup();
                });
                // newMarker.closePopup();
            });

            // Add to layers
            this.layers.push(newMarker);
        }
    }

    // Apply zoom
    applyChange(newCenter: LatLng) {
        this.center = newCenter;  // load coords
        this.map.setZoom(this.markerZoom); // set zoom
    }

    // On map ready
    onMapReady(map: Map) {
        this.map = map;
        // this.zoom = map.getZoom();
    }

}
