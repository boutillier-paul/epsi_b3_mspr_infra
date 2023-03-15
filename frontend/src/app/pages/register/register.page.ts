import { Component, forwardRef, Inject} from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
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
    private router: Router,
    @Inject(forwardRef(() => ApiService)) private api: ApiService
  ) { }
  saveName() {
    this.isNameCardVisible = false;
    setTimeout(() => {
      this.showFirstCard = false;
      this.showSecondCard = true;
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

    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    if (!regex.test(this.credentials2.pass)) {
      const alert = await this.alertController.create({
        header: 'Erreur',
        message:
          'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial (!@#$%^&*()_+-=[]{};:\'",./<>?).',
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
        await alert.present();
      } else if (res && res.hasOwnProperty('detail')) {
        const alert = await this.alertController.create({
          header: 'Erreur',
          message: res.detail,
          buttons: ['OK']
        });
        await alert.present();
      } else {
        console.log('La réponse de l\'API ne contient ni le token ni l\'erreur');
        console.log(res);
      }
    });
  }

}
