import { Component, forwardRef, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-mes-gardes-click',
  templateUrl: './mes-gardes-click.page.html',
  styleUrls: ['./mes-gardes-click.page.scss'],
})
export class MesGardesClickPage implements OnInit {
  imageUrl: string = '';
  imageOrientation: string = '';
  imageHeight: string = '';
  imageWidth: string = '';
  gardeSelectionnee: any;
  species: string ='';
  name: string ='';
  startdate: any;
  enddate: any;
  first_name: string;
  last_name: string;
  guard: any;
  plant: any;
  user: any;
  imageID: string;
  user_id: string;

  constructor(
    public alertController: AlertController,
    private router: Router,
    @Inject(forwardRef(() => ApiService)) private api: ApiService
  ) { }
  
  ngOnInit(): void {
    this.api.checkToken();
    this.api.getguard().subscribe((guardData: any) => {
      this.guard = guardData;
      this.enddate = this.guard.end_at;
      this.startdate = this.guard.start_at;
      this.imageID = this.guard.plant_id;
      localStorage.setItem('selectedPlantId', this.imageID);
      this.api.getplants().subscribe((plantData: any) => {
        this.plant = plantData;
        this.name = this.plant.name;
        this.species = this.plant.species;
        this.imageUrl = this.plant.photo;
        this.user_id = this.plant.user_id;
        localStorage.setItem('selectedUserId', this.user_id);
        this.api.getUserById().subscribe((userData: any) => {
          this.user = userData;
          this.first_name = this.user.first_name;
          this.last_name = this.user.last_name;
          this.imageOrientation = this.getImageOrientation(this.imageUrl);
          this.setImageSize();
        });
      });
    });
  }
  private getImageOrientation(imageUrl: string): string {
    const img = new Image();
    img.src = imageUrl;
    return img.width > img.height ? 'cover' : 'contain';
  }


  private setImageSize() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
  
    const img = new Image();
    img.onload = () => {
      const imgWidth = img.width;
      const imgHeight = img.height;
      const isSquare = imgWidth === imgHeight;
  
      if (this.imageOrientation === 'cover') {
        this.imageHeight = '100%';
        this.imageWidth = 'auto';
      } else {
        this.imageHeight = 'auto';
        this.imageWidth = '100%';
      }
      const aspectRatio = imgWidth / imgHeight;
      const maxWidth = windowWidth * 0.9;
      const maxHeight = windowHeight * 0.6;
  
      if (aspectRatio >= 1) {
        this.imageWidth = `${maxWidth}px`;
        this.imageHeight = 'auto';
      } else if (isSquare) {
        const maxImageSize = Math.min(maxWidth, maxHeight);
        this.imageWidth = `${maxImageSize}px`;
        this.imageHeight = `${maxImageSize}px`;
        this.imageOrientation = 'none';
      } else {
        this.imageHeight = `${maxHeight}px`;
        this.imageWidth = 'auto';
        this.imageOrientation = 'contain';
      }
      const imgEl = document.getElementById('my-img');
      if (imgEl) {
        const imgContainer = imgEl.parentElement;
        if (imgContainer) {
          imgContainer.style.display = 'flex';
          imgContainer.style.alignItems = 'center';
          imgContainer.style.justifyContent = 'center';
        }
      }
    };
    img.src = this.imageUrl;
  }

  async imgAlert() {
    const alert = await this.alertController.create({
      header: 'Aucune image trouvée',
      message: 'Aucune image n\'a été trouvée dans le stockage local.',
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
  gotosessions()
  {
    this.router.navigateByUrl('/historique-session');
  }
}