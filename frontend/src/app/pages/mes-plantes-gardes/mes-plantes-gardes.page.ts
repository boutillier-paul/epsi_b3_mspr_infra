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
  gardes: any[] = [];

  constructor(
    public alertController: AlertController,
    private router: Router,
    @Inject(forwardRef(() => ApiService)) private api: ApiService
  ) { }
  
  ngOnInit() {
    this.api.getplants().subscribe( (response: any) => {
        const guards = response.guards;
        this.gardes = guards.map((guard: any) => {
          return {
            id: guard.id,
            start_at: guard.start_at,
            end_at: guard.end_at,
            user_id: guard.user_id,
            first_name: '',
            last_name: '',
          };
        });
        console.log("Mon tableau :" + this.gardes)
        guards.forEach((guard: any, index: number) => {
          const userId = guard.user_id;
          this.api.getUserByIdParams(userId).subscribe((user: any) => {
            this.gardes[index].first_name = user.first_name;
            this.gardes[index].last_name = user.last_name;
            console.log('Tableau après get user par ID', this.gardes);
          });
        });
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
  async deleteGuardAsk(guardId: number) {
    const alert = await this.alertController.create({
      header: 'Confirmation requise',
      message: 'Êtes-vous sûr de vouloir supprimer cette garde ?',
      buttons: [
        {
          text: 'Non',
          handler: () => {
            this.router.navigate(['/mes-plantes-gardes']);
          }
        },
        {
          text: 'Oui',
          handler: () => {
            this.deleteGuard(guardId);
          }
        }
      ]
    
    });
    await alert.present();
    } 
  deleteGuard(guardId: number) {
    this.api.deleteGuard(guardId).subscribe(
      (data) => {
        if (data.created_at) {
          this.alertController.create({
            header: 'Succès',
            message: 'La suppression est validée !! ',
            buttons: ['OK']
          }).then(alert => alert.present());
        } else {
          this.delete_success();
        }
      },
      (error) => {
        this.alertController.create({
          header: 'Erreur lors de la suppression',
          message: error.detail,
          buttons: ['OK']
        }).then(alert => alert.present());
      }
    );
  }
  viewGuard(guardId: number){
    localStorage.setItem("selectedGuardId", guardId.toString());
    this.router.navigateByUrl('/historique-session');
  }
}
