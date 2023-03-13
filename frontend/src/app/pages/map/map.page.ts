import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api/api.service';

import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {
  map: L.Map;
  gardes: any[] = [];
  pos_lng: number;
  pos_lat: number;
  radius: 50;
  posLat: number;
  posLng: number

  constructor(private api: ApiService) { }

  ngOnInit() {
    if (navigator.geolocation) {
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        // L'utilisateur utilise un appareil mobile
        navigator.geolocation.watchPosition((position) => {
          this.pos_lat = position.coords.latitude;
          this.pos_lng = position.coords.longitude;
          this.initMap();
          this.getAndShowMarkers();
        });
      } else {
        // L'utilisateur utilise un PC
        navigator.geolocation.getCurrentPosition((position) => {
          this.pos_lat = position.coords.latitude;
          this.pos_lng = position.coords.longitude;
          this.initMap();
          this.getAndShowMarkers();
        });
      }
    } else {
      console.log('La géolocalisation n\'est pas supportée par ce navigateur.');
    }
  }

  initMap() {
    this.map = L.map('mapid', {
      center: [this.pos_lat, this.pos_lng],
      zoom: 13,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(this.map);

    const userIcon = L.icon({
      iconUrl: '../../../assets/icon/marker-user.png',
      iconSize: [40, 50],
      iconAnchor: [19, 38],
    });

    const userMarker = L.marker([this.pos_lat, this.pos_lng], { icon: userIcon }).addTo(this.map);
    userMarker.bindPopup('Vous êtes ici');
  }

  getAndShowMarkers() {
    this.posLat = this.pos_lat;
    this.posLng = this.pos_lng;
    this.api.getPlantsNearMe(this.pos_lat, this.pos_lng, this.radius).subscribe((response: any) => {
      const guards = response.guards;
      this.gardes = guards.map((guard: any) => {
        return {
          id: guard.id,
          plant_id: guard.plant_id,
          user_id: guard.user_id,
          start_at: guard.start_at,
          end_at: guard.end_at,
          name: '',
          species: '',
          pos_lat: '',
          pos_lng: '',
          first_name: '',
          last_name: '',
        };
      });

      console.log('Tableau de base', this.gardes);

      guards.forEach((guard: any, index: number) => {
        const plantId = guard.plant_id;
        this.api.getplantsbyid(plantId).subscribe((plant: any) => {
          this.gardes[index].name = plant.name;
          this.gardes[index].species = plant.species;
          this.gardes[index].pos_lat = plant.pos_lat;
          this.gardes[index].pos_lng = plant.pos_lng;
          console.log('Tableau après get plant par ID', this.gardes);
          L.marker([plant.pos_lat, plant.pos_lng]).addTo(this.map)
            .bindPopup(`<b>${guard.name}</b><br>${plant.species}`)
            .openPopup();
        });
        const userId = guard.user_id;
        this.api.getUserByIdParams(userId).subscribe((user: any) => {
          this.gardes[index].first_name = user.first_name;
          this.gardes[index].last_name = user.last_name;
          console.log('Tableau après get user par ID', this.gardes);
        });
      });
    });
  }
}