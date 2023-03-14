import { Component, forwardRef, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api/api.service';


@Component({
  selector: 'app-mes-plantes',
  templateUrl: './mes-plantes.page.html',
  styleUrls: ['./mes-plantes.page.scss'],
})
export class MesPlantesPage implements OnInit {
  plantes: any[] = [];

  constructor(
    public alertController: AlertController,
    private router: Router,
    @Inject(forwardRef(() => ApiService)) private api: ApiService
  ) { }

  async ngOnInit() {
    this.api.checkToken();
    this.api.getyouruser().subscribe(
      (res: any) => {
        this.plantes = res.plants;
      },
      async (error: any) => {
        if (error.status === 401) {
          // Display error alert and redirect to home page on "OK" click
          const alert = await this.alertController.create({
            header: 'Non autorisé',
            message: 'Votre token a expiré ou vous n\'avez pas accès à cette page',
            buttons: [
              {
                text: 'Aller à la page d\'accueil',
                handler: () => {
                  this.router.navigateByUrl('/home');
                }
              }
            ]
          });
          await alert.present();
        } else {
          // Handle other errors
        }
      }
    );
  }

  voirPlus(planteId: number) {
    localStorage.setItem('selectedPlantId', planteId.toString());
    this.router.navigateByUrl('/mes-plantes-click');
  }
}



