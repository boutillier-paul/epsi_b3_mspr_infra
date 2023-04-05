import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { ApiService } from '../../services/api/api.service';

@Component({
  selector: 'app-form-modify-user',
  templateUrl: './form-modify-user.page.html',
  styleUrls: ['./form-modify-user.page.scss'],
})
export class FormModifyUserPage implements OnInit {
  first_name: string;
  last_name: string;
  email: string;

  credentials = {
    first_name: '',
    last_name: '',
    email: ''
  };

  constructor(
    private router: Router,
    private api: ApiService,
    public alertController: AlertController,
    public modalController: ModalController
  ) { }

  ngOnInit() {
    this.api.checkToken();
    this.api.getyouruser().subscribe(
      (response: any) => {
        this.first_name = response.first_name;
        this.last_name = response.last_name;
        this.email = response.email;
      },
      async error => {
        const alert = await this.alertController.create({
          header: 'Error',
          message: error.message,
          buttons: ['OK']
        });
        await alert.present();
      }
    );
  }

  async updateUser() {

    if (!/^[a-zA-Z0-9]+$/.test(this.credentials.last_name) || !/^[a-zA-Z0-9]+$/.test(this.credentials.first_name)) {
      const alert = await this.alertController.create({
        header: 'Erreur',
        message: 'Caractères spéciaux et nombres non autorisés dans ces champs ',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.credentials.email)) {
      const alert = await this.alertController.create({
        header: 'Erreur',
        message: 'Caractères spéciaux non autorisés dans ces champs (Email)',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    try {
      const response = await this.api.updateUser(this.credentials).toPromise();
      if (response.created_at) {
        const alert = await this.alertController.create({
          header: 'Success',
          message: 'Votre profil a été modifié.',
          buttons: ['OK']
        });
        await alert.present();
        this.router.navigate(['/mon-profil']);
      } else {
        throw new Error('Une erreur est survenue');
      }
    } catch (error) {
      const alert = await this.alertController.create({
        header: 'Erreur',
        message: 'Une erreur est survenue',
        buttons: ['OK']
      });
      await alert.present();
    }
}
  dismiss() {
    this.modalController.dismiss();
  }

}