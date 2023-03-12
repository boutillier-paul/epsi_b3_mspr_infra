import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-historique-session-click',
  templateUrl: './historique-session-click.page.html',
  styleUrls: ['./historique-session-click.page.scss'],
})
export class HistoriqueSessionClickPage implements OnInit {
  sessionPicUrl: string = '';
  imageOrientation: string = '';
  imageHeight: string = '';
  imageWidth: string = '';
  SessionSelectionnee: any;
  created_at: string ='';
  rapport: string ='';

  constructor(private alertController: AlertController, private router: Router) {
  }

  
  ngOnInit() {
    const SessionSelectionneeString = localStorage.getItem('SessionSelectionnee');
    if (SessionSelectionneeString) {
      const SessionSelectionneeArray = SessionSelectionneeString.split(',');
      const SessionSelectionnee = JSON.parse(SessionSelectionneeString);
      this.created_at = SessionSelectionnee.created_at;
      this.rapport = SessionSelectionnee.rapport;
      this.sessionPicUrl = SessionSelectionnee.sessionpic
      this.setImageSize()
    }
    else{
      this.valAlert();
    }
  }
  private getImageOrientation(sessionPicUrl: string): string {
    const img = new Image();
    img.src = sessionPicUrl;
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
    img.src = this.sessionPicUrl;
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
