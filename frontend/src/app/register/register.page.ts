import { Component, forwardRef, Inject} from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ApiService } from '../api/api.service';
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


  
  // Méthode appelée lorsque vous cliquez sur le bouton Suivant dans la première carte
  saveName() {
    this.isNameCardVisible = false;
    setTimeout(() => {
      this.showFirstCard = false;
      this.showSecondCard = true;
    }, 500);
  }

  // Méthode appelée lorsque vous cliquez sur le bouton Suivant dans la première carte
  async saveLogin() {
    //                                              Route /signup/ 
    // Encrypter le mdp 
    // Vérifier que les mots de passe sont identiques
    if (this.credentials2.pass !== this.credentials2.passconf) {
      const alert = await this.alertController.create({
        header: 'Erreur',
        message: 'Les mots de passe ne sont pas identiques.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    // Vérifier que le mot de passe a plus de 8 caractères
    if (this.credentials2.pass.length < 8) {
      const alert = await this.alertController.create({
        header: 'Erreur',
        message: 'Le mot de passe doit contenir au moins 8 caractères.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    // Vérifier que le mot de passe contient une majuscule, une minuscule, un chiffre et un caractère spécial
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

    // Si toutes les conditions sont remplies, afficher un message de succès et enregistre le mdp et le login
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
