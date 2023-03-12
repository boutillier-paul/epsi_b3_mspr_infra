import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api/api.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {
  constructor(private apiService: ApiService) { }
  pos_lat: number;
  pos_lng: number;
  radius: number;

  ngOnInit() {
    if (navigator.geolocation) {
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        // L'utilisateur utilise un appareil mobile
        navigator.geolocation.watchPosition((position) => {
          const { latitude, longitude } = position.coords;
          this.pos_lat = position.coords.latitude;
          this.pos_lng = position.coords.longitude;
          this.radius = 100;
          this.apiService.getPlantsNearMe(this.pos_lat, this.pos_lng, this.radius).subscribe((response) => {
            if (response && typeof response === 'object') {
              const dataArray = Object.keys(response).map((key) => response[key]);
              dataArray.forEach((data: { start_at: any; end_at: any; plant_id: any; user_id: any; }) => {
                const { start_at, end_at, plant_id, user_id } = data;
                this.apiService.getplantsbyid(plant_id).subscribe((plantData) => {
                  const { name, species } = plantData;
                  this.apiService.getUserByIdParams(user_id).subscribe((userData) => {
                    const { first_name, last_name } = userData;
                    const table = [name, species, first_name, start_at, end_at, plant_id];
                    console.log(table);
                  });
                });
              });
            } else {
              console.log('La réponse n\'est pas un objet JSON : ', response);
            }
          }, (error: any) => {
            console.log('Erreur lors de l\'appel à l\'API : ', error);
          });
        }, (error) => {
          console.log('Erreur de géolocalisation : ', error);
        });
      } else {
        // L'utilisateur utilise un PC
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          this.pos_lat = position.coords.latitude;
          this.pos_lng = position.coords.longitude;
          this.radius = 100;
          this.apiService.getPlantsNearMe(this.pos_lat, this.pos_lng, this.radius).subscribe((response) => {
            if (response && typeof response === 'object') {
              const dataArray = Object.keys(response).map((key) => response[key]);
              dataArray.forEach((data: { start_at: any; end_at: any; plant_id: any; user_id: any; }) => {
                const { start_at, end_at, plant_id, user_id } = data;
                this.apiService.getplantsbyid(plant_id).subscribe((plantData) => {
                  const { name, species } = plantData;
                  this.apiService.getUserByIdParams(user_id).subscribe((userData) => {
                    const { first_name, last_name } = userData;
                    const table = [name, species, first_name, start_at, end_at, plant_id];
                    console.log(table);
                  });
                });
              });
            } else {
              console.log('La réponse n\'est pas un objet JSON', response);
            }
            }, (error: any) => {
              console.log('Erreur lors de l\'appel à l\'API : ', error);
            });
          }, (error) => {
            console.log('Erreur de géolocalisation : ', error);
          });
        }
      } else {
        console.log('La géolocalisation n\'est pas supportée par ce navigateur.');
      }
    }
  }
