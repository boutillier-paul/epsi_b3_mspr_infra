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
        }
      }
    );
  }

  voirPlus(planteId: number) {
    localStorage.setItem('selectedPlantId', planteId.toString());
    this.router.navigateByUrl('/mes-plantes-click');
  }

  savePlantId(id: number) {
    localStorage.setItem('selectedPlantId', String(id));
    this.router.navigate(['/mes-plantes-click']);
  }

  
  async deletePlantId(id: number) {
    localStorage.setItem('selectedPlantId', String(id));
    const alert = await this.alertController.create({
      header: 'Confirmation requise',
      message: 'Êtes-vous sûr de vouloir supprimer cette plante ?',
      buttons: [
        {
          text: 'Non',
          handler: () => {
            this.router.navigate(['/mon-profil']);
          }
        },
        {
          text: 'Oui',
          handler: () => {
            this.deletePlantconf();
          }
        }
      ]
    
    });
    await alert.present();
    }
    async deletePlantconf(){
      this.api.deletePlant().subscribe(async res => {
        if (res && res.hasOwnProperty('created_at')) {
          const alert = await this.alertController.create({
            header: 'Succès',
            message: "Votre plante a été supprimé.",
            buttons: [        {
              text: 'Ok',
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
    }
}



