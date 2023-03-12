import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-declare',
  templateUrl: './form-declare.page.html',
  styleUrls: ['./form-declare.page.scss'],
})
export class FormDeclarePage implements OnInit {
  credentials = {
    species: '',
    name: '',
  };
  public selectedFile: File | null = null;

  constructor(
    private alertController: AlertController,
    private router: Router,
    private api: ApiService
  ) {}

  ngOnInit() {
    if (navigator.geolocation) {
      if (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
      ) {
        // L'utilisateur utilise un appareil mobile
        navigator.geolocation.watchPosition(
          (position) => {
            // La position de l'utilisateur a changé, elle est disponible dans l'objet `position`
            const { latitude, longitude } = position.coords;
            // Stocker les valeurs dans le localStorage
            localStorage.setItem('pos_lat', String(latitude));
            localStorage.setItem('pos_lng', String(longitude));
          },
          (error) => {
            console.log('Erreur de géolocalisation : ', error);
          }
        );
      } else {
        // L'utilisateur utilise un PC
        navigator.geolocation.getCurrentPosition(
          (position) => {
            // La position de l'utilisateur est disponible dans l'objet `position`
            const { latitude, longitude } = position.coords;
            // Stocker les valeurs dans le localStorage
            localStorage.setItem('pos_lat', String(latitude));
            localStorage.setItem('pos_lng', String(longitude));
          },
          (error) => {
            console.log('Erreur de géolocalisation : ', error);
          }
        );
      }
    } else {
      console.log("La géolocalisation n'est pas supportée par ce navigateur.");
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.selectedFile = file;
  }

  async declarer() {
    if (!this.selectedFile) {
      const alert = await this.alertController.create({
        header: 'Attention',
        message: 'Veuillez sélectionner une image de déclarer votre plante.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }
  
    const speciesInput = document.getElementsByName('species')[0] as HTMLInputElement;
  
    if (!speciesInput.value) {
      const alert = await this.alertController.create({
        header: 'Attention',
        message: 'Veuillez insérer l\'espèce de la plante avant de la déclarer.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }
  
    const nameInput = document.getElementsByName('name')[0] as HTMLInputElement;
  
    if (!nameInput.value) {
      const alert = await this.alertController.create({
        header: 'Attention',
        message: 'Veuillez insérer le nom de la plante avant de la déclarer.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }
  
    const fd = new FormData();
    fd.append('species', this.credentials.species);
    fd.append('name', this.credentials.name);
    const latitude = localStorage.getItem('latitude');
    const longitude = localStorage.getItem('longitude');
    if (latitude !== null && longitude !== null) {
      fd.append('pos_lat', latitude);
      fd.append('pos_lng', longitude);
    }
    this.api.postPlant(fd).subscribe(async res => {
      console.log(fd);
      if (res && res.hasOwnProperty('created_at')) {
        const alert = await this.alertController.create({
          header: 'Plante déclarée',
          message: 'La plante a été déclarée avec succès.',
          buttons: ['OK']
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
