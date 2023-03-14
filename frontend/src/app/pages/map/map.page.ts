import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api/api.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
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

  constructor(private api: ApiService, private router: Router, public alertController: AlertController) {}

  ngOnInit() {
    if (navigator.geolocation) {
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        // L'utilisateur utilise un appareil mobile
        navigator.geolocation.watchPosition((position) => {
          this.pos_lat = position.coords.latitude;
          this.pos_lng = position.coords.longitude;
          this.initMap();
          this.posLat = this.pos_lat;
          this.posLng = this.pos_lng
          console.log(this.posLat);
          console.log(this.posLng);
          console.log(this.radius);
          this.getAndShowMarkers();
        });
      } else {
        // L'utilisateur utilise un PC
        navigator.geolocation.getCurrentPosition((position) => {
          this.pos_lat = position.coords.latitude;
          this.pos_lng = position.coords.longitude;
          this.initMap();
          this.posLat = this.pos_lat;
          this.posLng = this.pos_lng
          console.log(this.posLat);
          console.log(this.posLng);
          console.log(this.radius);
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
      console.log(guards);
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
  
      console.log('Tableau de base', this.gardes);
  
      guards.forEach((guard: any, index: number) => {
        const plantId = guard.plant_id;
        this.api.getplantsbyid(plantId).subscribe((plant: any) => {
          this.gardes[index].name = plant.name;
          this.gardes[index].species = plant.species;
          this.gardes[index].photo = 'https://mspr-infra-bucket.s3.eu-west-3.amazonaws.com/images/' + plant.photo;
          this.gardes[index].pos_lat = plant.pos_lat;
          this.gardes[index].pos_lng = plant.pos_lng;
          console.log('Tableau après get plant par ID', this.gardes);
  
          const marker = L.marker([plant.pos_lat, plant.pos_lng]).addTo(this.map);
          const popupContent = document.createElement('div');
          popupContent.style.backgroundColor = 'green';
          popupContent.style.borderRadius = '75px';
          popupContent.style.padding = '10px';
          popupContent.style.textAlign = 'center';
          popupContent.innerHTML = `
            <b>${plant.name}</b><br>${plant.species}<br>
            <img src="${plant.photo}" alt="${plant.species}" width="200px"/><br>
            <button style="margin-top: 10px;" id="save-guard-button-${guard.id}">Garder la plante</button>
          `;
          const button = popupContent.querySelector(`#save-guard-button-${guard.id}`);
          if (button) {
            button.addEventListener('click', async () => {
              console.log('Garder la plante avec ID:', guard.id);
              this.selectedGuardId = guard.id;
              localStorage.setItem('selectedGuardId', this.selectedGuardId.toString());
              const alert = await this.alertController.create({
              header: 'Confirmation requise',
              message: 'Êtes-vous sûr de vouloir supprimer ce post ?',
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
    console.log(localStorage.getItem('access_token'));
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
          console.log('La réponse de l\'API ne contient ni le token ni le detail de l\'erreur');
          console.log(res);
          const alert = await this.alertController.create({
            header: 'Erreur de type inconnu',
            message: res.detail,
            buttons: ['OK']
          });
          await alert.present();
        }
      });
  }
}