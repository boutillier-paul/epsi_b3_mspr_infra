import { Component, forwardRef, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController} from '@ionic/angular';
import { ApiService } from 'src/app/services/api/api.service';

interface Plant {
  id: number;
  name: string;
  species: string;
  photo: string;
  created_at: string;
}

@Component({
  selector: 'app-mon-profil',
  templateUrl: './mon-profil.page.html',
  styleUrls: ['./mon-profil.page.scss'],
})
export class MonProfilPage implements OnInit {
  last_name: string;
  first_name: string;
  email: string;
  plants: Plant[];
  gardes: any[];
  advices: any[];
  role_id: number;

  constructor(
    public alertController: AlertController,
    private router: Router,
    @Inject(forwardRef(() => ApiService)) private api: ApiService
  ) { }

  ngOnInit() {
    this.api.checkToken();
    this.api.getyouruser().subscribe(
      (res: any) => {
        this.last_name = res.last_name;
        this.first_name = res.first_name;
        this.email = res.email;
        this.plants = res.plants.sort((a: Plant, b: Plant) => {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }).slice(0, 3);
        this.role_id = res.role_id;
        if (this.role_id === 1) {
          this.gardes = [];
          this.advices = [];
        } else {
          this.loadGuards(res.guards);
          this.advices = res.advices.sort((a: any, b: any) => {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          }).slice(0, 10);
        }
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


  savePlantId(id: number) {
    localStorage.setItem('selectedPlantId', String(id));
    this.router.navigate(['/mes-plantes-click']);
  }

  saveGuardId(id: number) {
    localStorage.setItem('selectedGuardId', String(id));
    this.router.navigate(['/mes-gardes-click']);
  }

  saveAdviceId(id: number) {
    localStorage.setItem('selectedAdviceId', String(id));
    this.router.navigate(['/form-modify-advice']);
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

 async deleteAdviceId(id: number) {
    localStorage.setItem('selectedAdviceId', String(id));
    const alert = await this.alertController.create({
      header: 'Confirmation requise',
      message: 'Êtes-vous sûr de vouloir supprimer ce post ?',
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
            this.deleteAdviceconf();
          }
        }
      ]
    
    });
    await alert.present();
    } 
    async deleteAdviceconf(){
      this.api.deleteAdviceById().subscribe(async res => {
        if (res && res.hasOwnProperty('title')) {
          const alert = await this.alertController.create({
            header: 'Succès',
            message: "Votre post a été supprimé.",
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