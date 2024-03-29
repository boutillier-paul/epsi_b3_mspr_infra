import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api/api.service';
import { AlertController, RangeCustomEvent } from '@ionic/angular';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
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
  radius: number = 100;
  posLat: number;
  posLng: number;
  selectedGuardId: number;
  previousValue: number;
  selectedValue: number;

  constructor(private api: ApiService, private router: Router, public alertController: AlertController) {}

  async ngOnInit() {
    this.api.checkToken();
    this.api.checkRole();
    if (navigator.geolocation) {
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        navigator.geolocation.watchPosition((position) => {
          this.pos_lat = position.coords.latitude;
          this.pos_lng = position.coords.longitude;
          this.initMap();
          this.posLat = this.pos_lat;
          this.posLng = this.pos_lng
          this.getAndShowMarkers();
        });
      } else {
        navigator.geolocation.getCurrentPosition((position) => {
          this.pos_lat = position.coords.latitude;
          this.pos_lng = position.coords.longitude;
          this.initMap();
          this.posLat = this.pos_lat;
          this.posLng = this.pos_lng
          this.getAndShowMarkers();
        });
      }
    } else {
      const alert = await this.alertController.create({
        header: 'Avertissement',
        message: 'La géolocalisation n\'est pas supporté sur cette plateforme !',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  initMap() {
    this.map = L.map('mapid', {
      center: [this.pos_lat, this.pos_lng],
      zoom: 13,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
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
    this.api.getPlantsNearMe(this.posLat, this.posLng, this.radius).subscribe((response: any) => {
      const guards = response;
      this.gardes = guards.map((guard: any) => {
        return {
          id: guard.id,
          plant_id: guard.plant_id,
          user_id: guard.user_id,
          start_at: guard.start_at,
          end_at: guard.end_at,
          name: '',
          species: '',
          photo: '',
          pos_lat: '',
          pos_lng: '',
        };
      });
  
      guards.forEach((guard: any, index: number) => {
        const plantId = guard.plant_id;
        this.api.getplantsbyid(plantId).subscribe((plant: any) => {
          this.gardes[index].name = plant.name;
          this.gardes[index].species = plant.species;
          this.gardes[index].photo = 'https://mspr-infra-bucket.s3.eu-west-3.amazonaws.com/images/' + plant.photo;
          this.gardes[index].pos_lat = plant.pos_lat;
          this.gardes[index].pos_lng = plant.pos_lng;
  
          const plantIcon = L.icon({
            iconUrl: '../../../assets/icon/marker-plant.png',
            iconSize: [40, 50],
            iconAnchor: [19, 38],
          });
          
          const marker = L.marker([plant.pos_lat, plant.pos_lng], { icon: plantIcon }).addTo(this.map);
          const popupContent = document.createElement('div');
          popupContent.style.backgroundColor = 'white';
          popupContent.style.borderRadius = '75px';
          popupContent.style.padding = '10px';
          popupContent.style.textAlign = 'center';
          const startDate = new Date(guard.start_at);
          const endDate = new Date(guard.end_at);
          const formattedStartDate = `${startDate.getDate().toString().padStart(2, '0')}/${(startDate.getMonth() + 1).toString().padStart(2, '0')}/${startDate.getFullYear().toString()}`;
          const formattedEndDate = `${endDate.getDate().toString().padStart(2, '0')}/${(endDate.getMonth() + 1).toString().padStart(2, '0')}/${endDate.getFullYear().toString()}`;
          popupContent.style.maxWidth = '300px';
          popupContent.style.maxHeight = '350px';
          popupContent.innerHTML = `
            <b>Nom : ${plant.name}</b><br>Espèce : ${plant.species}<br>Du ${formattedStartDate} au ${formattedEndDate}<br>
            <img src="${this.gardes[index].photo}" width="200px"/><br>
            <ion-button style="margin-top: 10px;" id="save-guard-button-${guard.id}">Garder la plante</ion-button>
          `;
          popupContent.style.width = 'max-content';
          const button = popupContent.querySelector(`#save-guard-button-${guard.id}`);
          if (button) {
            button.addEventListener('click', async () => {
              this.selectedGuardId = guard.id;
              localStorage.setItem('selectedGuardId', this.selectedGuardId.toString());
              const alert = await this.alertController.create({
              header: 'Confirmation requise',
              message: 'Êtes-vous sûr de vouloir garder cette plante ?',
              buttons: [
                {
                  text: 'Non',
                  handler: () => {
                    this.router.navigate(['/map']);
                  }
                },
                {
                  text: 'Oui',
                  handler: () => {
                    this.guardPlant();
                  }
                }
              ]
              });
              await alert.present();
            });
          }
          marker.bindPopup(popupContent);
        });
      });
    });
  }
  guardPlant(){
    this.api.takeGuard(this.selectedGuardId).subscribe(async res => {
        if (res && res.hasOwnProperty('created_at')) {
          const alert = await this.alertController.create({
            header: 'Succès',
            message: "Vous garderez actuellement cette plante désormais.",
            buttons: [        {
              text: 'Voir mon profil',
              handler: () => {
                this.router.navigate(['/mon-profil']);
              }
            }
          ]
          });
          await alert.present();
        } else if (res && res.hasOwnProperty('detail')) {
          const alert = await this.alertController.create({
            header: 'Erreur',
            message: res.detail,
            buttons: ['OK']
          });
          await alert.present();
        } else {
          const alert = await this.alertController.create({
            header: 'Erreur de type inconnu',
            message: 'Une erreur de type inconnue s\'est produite',
            buttons: ['OK']
          });
          await alert.present();
        }
      });
  }
  onRangeModelChange(newValue: number) {
    if (newValue < this.previousValue) {
      setTimeout(() => {
        this.selectedValue = this.previousValue;
        
      }, 0);
    } else {
      this.previousValue = newValue;
      this.radius = newValue;
      this.getAndShowMarkers();
    }
  }
}
