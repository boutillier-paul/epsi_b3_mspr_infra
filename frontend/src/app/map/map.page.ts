import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {
  latitudegps : number = 0
  longitudegps : number = 0
  constructor() { }

  ngOnInit() {
    if (navigator.geolocation) {
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        // L'utilisateur utilise un appareil mobile
        navigator.geolocation.watchPosition((position) => {
          // La position de l'utilisateur a changé, elle est disponible dans l'objet `position`
          const { latitude, longitude } = position.coords;
          console.log(latitude, longitude);
          // Stocker les valeurs dans le localStorage
          localStorage.setItem('latitude', String(latitude));
          localStorage.setItem('longitude', String(longitude));
        }, (error) => {
          console.log('Erreur de géolocalisation : ', error);
        });
      } else {
        // L'utilisateur utilise un PC
        navigator.geolocation.getCurrentPosition((position) => {
          // La position de l'utilisateur est disponible dans l'objet `position`
          const { latitude, longitude } = position.coords;
          console.log(latitude, longitude);
          // Stocker les valeurs dans le localStorage
          localStorage.setItem('latitude', String(latitude));
          localStorage.setItem('longitude', String(longitude));
        }, (error) => {
          console.log('Erreur de géolocalisation : ', error);
        });
      }
    } else {
      console.log('La géolocalisation n\'est pas supportée par ce navigateur.');
    }
  }
  // Get /users/me/ 
  // Post //
}
