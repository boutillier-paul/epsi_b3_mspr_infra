import { Component, forwardRef, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api/api.service';
@Component({
  selector: 'app-mes-plantes-click',
  templateUrl: './mes-plantes-click.page.html',
  styleUrls: ['./mes-plantes-click.page.scss'],
})
export class MesPlantesClickPage implements OnInit {
  imageUrl: string = '';
  imageOrientation: string = '';
  imageHeight: string = '';
  imageWidth: string = '';
  espece: string ='';
  name: string ='';
  startdate: any;
  guards: any[] = [];
  vardisabled: boolean = false;
  selectedPlantId: any;

  constructor(
    public alertController: AlertController,
    private router: Router,
    @Inject(forwardRef(() => ApiService)) private api: ApiService
  ) { }
  
 async ngOnInit() {
  this.api.checkToken();
  this.api.getplants().subscribe(
    (res: any) => {
      this.name = res.name;
      this.espece = res.species;
      this.imageUrl = res.photo;
      this.guards = res.guards;
      if (this.guards.length === 0) {
        this.vardisabled = true;
      }
      this.imageOrientation = this.getImageOrientation(this.imageUrl);
      this.setImageSize();
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
  }
  gotoguards()
  {
    this.router.navigateByUrl('/mes-plantes-gardes');
  }
  // Get /plants/details/idplante
}
