import { Component, forwardRef, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-mes-plantes-gardes',
  templateUrl: './mes-plantes-gardes.page.html',
  styleUrls: ['./mes-plantes-gardes.page.scss'],
})
export class MesPlantesGardesPage implements OnInit {
  plantId: number;
  plantName: string;
  guards: any[] = [];

  constructor(
    public alertController: AlertController,
    private router: Router,
    @Inject(forwardRef(() => ApiService)) private api: ApiService
  ) { }
  
  ngOnInit() {
    this.api.getplants().subscribe(
      (response: any) => {
        this.plantName = response.name;
        const guards = response.guards;
        for (let guard of guards) {
          const userId = guard.user_id;
          localStorage.setItem('selectedUserID', userId)
          this.api.getUserById().subscribe(
            (userResponse: any) => {
              guard.userName = `${userResponse.last_name} ${userResponse.first_name}`;
            },
            async (error) => {
              if (error.status === 401) {
                const alert = await this.alertController.create({
                  header: 'Erreur 401',
                  message: 'Votre session a expiré. Veuillez vous reconnecter.',
                  buttons: [
                    {
                      text: 'OK',
                      handler: () => {
                        // Naviguez vers la page de connexion
                      }
                    }
                  ]
                });
                await alert.present();
              } else {
                console.log('Une erreur s\'est produite :', error);
              }
            }
          );
        }

        // Enregistre les gardes dans la variable de classe pour l'affichage
        this.guards = guards;
      },
      async (error) => {
        if (error.status === 401) {
          const alert = await this.alertController.create({
            header: 'Erreur 401',
            message: 'Votre session a expiré. Veuillez vous reconnecter.',
            buttons: [
              {
                text: 'OK',
                handler: () => {
                  // Naviguez vers la page de connexion
                }
              }
            ]
          });
          await alert.present();
        } else {
          console.log('Une erreur s\'est produite :', error);
        }
      }
    );
  }
  
  async valAlert() {
    const alert = await this.alertController.create({
      header: 'Valeurs manquantes',
      message: 'Certaines données ne sont pas dans le local Storage !!!',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.router.navigateByUrl('/mes-plantes');
          },
        },
      ],
    });

    await alert.present();
  }
  async delete_success() {
    const alert = await this.alertController.create({
      header: 'Suppression réussie',
      message: 'Cet historique de sessions a été effacée',
      buttons: [
        {
          text: 'Retourner à la page de ma plante',
          handler: () => {
            this.router.navigateByUrl('/mes-plantes-click');
          },
        },
      ],
    });

    await alert.present();
  }
  deleteGuard(guardId: number) {
  this.api.deleteGuard(guardId).subscribe((data) => {
      this.delete_success();
     });
  };
  viewGuard(guardId: number){

  }
}
