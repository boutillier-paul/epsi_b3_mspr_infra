import { Component } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api/api.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TermsPage } from '../terms/terms.page';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {

  articles: any[] = [];
  selectedArticle: any = null;
  selectedArticleModal: any = null;

  credentials1 = {
    nom: '',
    prenom: '',
    email: ''
  };

  credentials2 = {
    login: '',
    pass: '',
    passconf: ''
  };
  showFirstCard = true;
  showSecondCard = false;
  isNameCardVisible = true;

  constructor(
    public alertController: AlertController,
    private modalController: ModalController,
    private router: Router,
    private http: HttpClient,
    private api: ApiService
  ) {
  }

  ngOnInit() {
    this.selectedArticleModal = document.getElementById('my-modal');
  }


  saveName() {
    this.isNameCardVisible = false;
    setTimeout(() => {
      this.showFirstCard = false;
      this.showSecondCard = true;
    }, 500);
  }

  returnName() {
    this.isNameCardVisible = true;
    setTimeout(() => {
      this.showSecondCard = false;
      this.showFirstCard = true;      
    }, 500);
  }

  async saveLogin() {
    if (this.credentials2.pass !== this.credentials2.passconf) {
      const alert = await this.alertController.create({
        header: 'Erreur',
        message: 'Les mots de passe ne sont pas identiques.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    if (this.credentials2.pass.length < 8) {
      const alert = await this.alertController.create({
        header: 'Erreur',
        message: 'Le mot de passe doit contenir au moins 8 caractères.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    if (!/^[a-zA-Z0-9]+$/.test(this.credentials1.nom) || !/^[a-zA-Z0-9]+$/.test(this.credentials1.prenom) || !/^[a-zA-Z0-9]+$/.test(this.credentials2.login)) {
      const alert = await this.alertController.create({
        header: 'Erreur',
        message: 'Caractères spéciaux non autorisés dans ces champs ( Nom, Prenom ou Identifiant)',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.credentials1.email)) {
      const alert = await this.alertController.create({
        header: 'Erreur',
        message: 'Caractères spéciaux non autorisés dans ces champs (Email)',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    const regex = /^[A-Za-z\d@$!%?&]{8,}$/;
    if (!regex.test(this.credentials2.pass)) {
      const alert = await this.alertController.create({
        header: 'Erreur',
        message:
          'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }
    const alert = await this.alertController.create({
      header: 'Succès',
      message: 'Le mot de passe est valide !',
      buttons: [
        {
          text: 'Envoyer le formulaire',
          handler: () => {
            this.signup();
          }
        }
      ]

    });
    await alert.present();
  }

  
  async signup(){
    this.api.signup(this.credentials1, this.credentials2).subscribe(async res => {
      if (res && res.hasOwnProperty('access_token')) {
        const alert = await this.alertController.create({
          header: 'Succès',
          message: 'Votre compte a été créé !',
          buttons: [
            {
              text: 'Se connecter',
              handler: () => {
                this.router.navigate(['/login']);
              }
            }
          ]
    
        });
        this.router.navigate(['/login']);
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
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: TermsPage,
      cssClass: 'terms-css',
    });
    return await modal.present();
  }
    
  async dismissModal() {
    return await this.modalController.dismiss();
  }
}

