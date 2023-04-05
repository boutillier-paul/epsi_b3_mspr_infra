import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api/api.service';
import { AlertController} from '@ionic/angular';

@Component({
  selector: 'app-mes-gardes',
  templateUrl: './mes-gardes.page.html',
  styleUrls: ['./mes-gardes.page.scss'],
})
export class MesGardesPage implements OnInit {
  
  gardes: any[] = [];

  constructor(
    public alertController: AlertController,
    private router: Router,
    private api: ApiService
  ) {}

  ngOnInit() {
    this.api.checkToken();
    this.api.getyouruser().subscribe((response: any) => {
      this.loadGuards(response.guards);
    });
  }

  loadGuards(guards: any[]) {
    this.gardes = guards.slice(0, 3).map((guard: any) => {
      return {
        id: guard.id,
        start_at: guard.start_at,
        end_at: guard.end_at,
        plant_id: guard.plant_id,
        user_id: '',
        photo: '',
        name: '',
        last_name: '',
        first_name: ''
      };
    });
    guards.slice(0, 3).forEach((guard: any, index: number) => {
      const plantId = guard.plant_id;
      this.api.getplantsbyid(plantId).subscribe((plant: any) => {
        this.gardes[index].name = plant.name;
        this.gardes[index].photo = plant.photo;
        this.gardes[index].user_id = plant.user_id;
  
        const userId = plant.user_id;
        this.api.getUserByIdParams(userId).subscribe((user: any) => {
          this.gardes[index].first_name = user.first_name;
          this.gardes[index].last_name = user.last_name;
        });
      });
    });
  }

  saveGuardId(id: number) {
    localStorage.setItem('selectedGuardId', String(id));
    this.router.navigate(['/mes-gardes-click']);
  }

  async cancelGuardId(id: number) {
    localStorage.setItem('selectedGuardId', String(id));
    const alert = await this.alertController.create({
      header: 'Confirmation requise',
      message: 'Êtes-vous sûr de vouloir annuler cette garde ?',
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
            this.cancelGuardconf();
          }
        }
      ]
    
    });
    await alert.present();
    }
    async cancelGuardconf(){
      this.api.cancelGuard().subscribe(async res => {
        if (res && res.hasOwnProperty('created_at')) {
          const alert = await this.alertController.create({
            header: 'Succès',
            message: "Votre garde a été annulée.",
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