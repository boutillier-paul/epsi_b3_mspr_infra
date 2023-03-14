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
