import { Component, forwardRef, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ApiService } from '../api/api.service';

interface Plant {
  name: string;
  species: string;
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

  constructor(
    public alertController: AlertController,
    private router: Router,
    @Inject(forwardRef(() => ApiService)) private api: ApiService
  ) { }

  async ngOnInit() {
    this.api.getyouruser().subscribe(
      (response: any) => {
        this.last_name = response.last_name;
        this.first_name = response.first_name;
        this.plants = response.plants;
        this.guards = response.guards;
        this.advices = response.advices;
      },
      async (error: any) => {
        const detail = error.detail[0];
        const alert = await this.alertController.create({
          header: 'Erreur',
          message: `${detail.loc[0]} : ${detail.msg}`,
          buttons: ['OK'],
        });
        await alert.present();
      }
    );
  }
}