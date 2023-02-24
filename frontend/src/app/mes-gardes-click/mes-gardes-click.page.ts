import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

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
  espece: string ='';
  name: string ='';
  startdate: any;
  enddate: any;

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
    const gardeSelectionneeString = localStorage.getItem('gardeSelectionnee');
    if (gardeSelectionneeString) {
      const gardeSelectionneeArray = gardeSelectionneeString.split(',');
      const gardeSelectionnee = JSON.parse(gardeSelectionneeString);
      this.espece = gardeSelectionnee.espece;
      this.name = gardeSelectionnee.name;
      this.startdate = gardeSelectionnee.startdate;
      this.enddate = gardeSelectionnee.enddate;
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
}