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
    photo: '',
    pos_lat: 0,
    pos_lng: 0
  };
  selectedFile: {filename: string , data: string};

  constructor(
    private alertController: AlertController,
    private api: ApiService,
    private router: Router,
  ) {}

  async ngOnInit() {
    this.api.checkToken();
    if (navigator.geolocation) {
      if (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
      ) {
        navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            localStorage.setItem('pos_lat', String(latitude));
            localStorage.setItem('pos_lng', String(longitude));
          },
        );
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            localStorage.setItem('pos_lat', String(latitude));
            localStorage.setItem('pos_lng', String(longitude));
          },
        );
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

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          this.selectedFile = {
            filename: file.name,
            data: reader.result.toString().split(',')[1]
          };
        }
      };
      reader.readAsDataURL(file);
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop();
    }
  }

  async declarer() {
    if (!this.selectedFile) {
      const alert = await this.alertController.create({
        header: 'Attention',
        message: 'Veuillez sélectionner une image avant de déclarer votre plante.',
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
  
    if (!/^[a-zA-Z0-9 ]+$/.test(this.credentials.species) || !/^[a-zA-Z0-9 ]+$/.test(this.credentials.name)) {
      const alert = await this.alertController.create({
        header: 'Erreur',
        message: 'Caractères spéciaux non autorisés dans ces champs ',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }


    this.api.postPhoto(this.selectedFile).subscribe(async res => {
      if (res && res.hasOwnProperty('filename')) {
        this.credentials.photo = res.filename;
        this.credentials.pos_lat = parseFloat(localStorage.getItem('pos_lat') || '');
        this.credentials.pos_lng = parseFloat(localStorage.getItem('pos_lng') || '');

        this.api.postPlant(this.credentials).subscribe(async res => {
          if (res && res.hasOwnProperty('created_at')) {
            const alert = await this.alertController.create({
              header: 'Plante déclarée',
              message: 'La plante a été déclarée avec succès.',
              buttons: [
                {
                  text: 'OK',
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
              message: 'Une erreur inconnue est survenue.',
              buttons: ['OK']
            });
            await alert.present();
          }
        });

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
          message: 'Une erreur inconnue est survenue.',
          buttons: ['OK']
        });
        await alert.present();
      }
    })
    
  }
}
