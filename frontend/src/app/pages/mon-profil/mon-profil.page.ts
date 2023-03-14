import { Component, forwardRef, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
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
  plants: Plant[];
  guards: any[];
  advices: any[];
  role_id: number;

  constructor(
    public alertController: AlertController,
    private router: Router,
    @Inject(forwardRef(() => ApiService)) private api: ApiService
  ) { }

  async ngOnInit() {
    this.api.checkToken();
    this.api.getyouruser().subscribe(
      (res: any) => {
        this.last_name = res.last_name;
        this.first_name = res.first_name;
        this.plants = res.plants.sort((a: Plant, b: Plant) => {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }).slice(0, 3);
        this.role_id = res.role_id;
        if (this.role_id === 1) {
          this.guards = [];
          this.advices = [];
        } else {
          this.guards = res.guards.slice(0, 3);
          this.advices = res.advices.slice(0, 10);
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
  async checkToken() {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      await this.router.navigate(['/mon-profil']);
    } else {
      const alert = await this.alertController.create({
        header: 'Erreur',
        message: 'Vous devez être connecté pour accéder à cette page.',
        buttons: [
          {
            text: 'OK',
            handler: () => {
              this.router.navigate(['/home']);
            }
          }
        ]
      });
      await alert.present();
    }
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

