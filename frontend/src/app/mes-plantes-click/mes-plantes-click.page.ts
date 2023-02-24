import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

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
  planteSelectionnee: any;
  espece: string ='';
  name: string ='';
  startdate: any;
  statusgarde: any;
  vardisabled: boolean = false;

  constructor(private alertController: AlertController, private router: Router) {
  }

  
  ngOnInit() {
    const storedUrl = localStorage.getItem('imageSrc');
    if (storedUrl) {
      this.imageUrl = storedUrl;
      this.imageOrientation = this.getImageOrientation(this.imageUrl);
      this.setImageSize();
    } else {
      this.imgAlert();
    }
    const planteSelectionneeString = localStorage.getItem('planteSelectionnee');
    if (planteSelectionneeString) {
      const planteSelectionneeArray = planteSelectionneeString.split(',');
      const planteSelectionnee = JSON.parse(planteSelectionneeString);
      this.espece = planteSelectionnee.espece;
      this.name = planteSelectionnee.name;
      this.statusgarde = planteSelectionnee.statusgarde;
      if (this.statusgarde == 'false')
      {
        this.vardisabled = true;
      }
      else if (this.statusgarde == 'true')
      {
        this.vardisabled = false;
      }
      this.startdate = planteSelectionnee.startdate;
      if (!this.startdate) {
        this.startdate = null;
      }  
    }
  }
  private getImageOrientation(imageUrl: string): string {
    const img = new Image();
    img.src = imageUrl;
    return img.width > img.height ? 'cover' : 'contain';
  }


  private setImageSize() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    if (this.imageOrientation === 'cover') {
      this.imageHeight = '100%';
      this.imageWidth = 'auto';
    } else {
      this.imageHeight = 'auto';
      this.imageWidth = '100%';
    }

    // apply max height and width based on screen dimensions
    const img = new Image();
    img.onload = () => {
      if (img.width >= img.height) {
        this.imageWidth = `${Math.round(windowWidth * 0.9)}px`;
        this.imageHeight = 'auto';
      } else {
        this.imageWidth = 'auto';
        this.imageHeight = `${Math.round(windowHeight * 0.4)}px`;
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
  // Get /plants/details/idplante
}