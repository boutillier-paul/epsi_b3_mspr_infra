import { Component, forwardRef, Inject} from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage{

  constructor(
    public alertController: AlertController,
    private router: Router,
    @Inject(forwardRef(() => ApiService)) private api: ApiService
  ) { }

  credentials = {
    login: '',
    pass: ''
  };

  ngOnInit() {
  }

  async login(){

    if (!/^[a-zA-Z0-9]+$/.test(this.credentials.login)) {
      const alert = await this.alertController.create({
        header: 'Erreur',
        message: 'Caractères spéciaux non autorisés dans le champ',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    this.api.login(this.credentials).subscribe(async res => {
      if (res && res.hasOwnProperty('access_token')) {
        this.router.navigateByUrl('/advices');
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
}
