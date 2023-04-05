import { Component, forwardRef, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-form-modify-advice',
  templateUrl: './form-modify-advice.page.html',
  styleUrls: ['./form-modify-advice.page.scss'],
})
export class FormModifyAdvicePage implements OnInit {
  post: any = {};
  first_name: string = '';
  last_name: string = '';
  imageUrl: string = '';
  imageOrientation: string = '';
  imageHeight: string = '';
  imageWidth: string = '';
  credentials = {
    title: '',
    content: ''
  };

  constructor(
    public alertController: AlertController,
    private router: Router,
    @Inject(forwardRef(() => ApiService)) private api: ApiService
  ) { }

  ngOnInit() {
    this.api.checkToken();
    this.api.getAdvicesById().subscribe((data) => {
      this.post = data;
      localStorage.setItem('selectedUserId', this.post.user_id);
      this.api.getUserById().subscribe((userData) => {
        const { first_name, last_name } = userData;
        this.first_name = first_name;
        this.last_name = last_name;
        this.imageUrl = this.post.photo;
        this.imageOrientation = this.getImageOrientation(this.imageUrl);
        this.setImageSize();
      });
    });
    window.addEventListener('resize', () => {
      this.onResize();
    });
  }
  onResize() {
    this.setImageSize();
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
      this.imageHeight = '50%';
      this.imageWidth = 'auto';
    } else {
      this.imageHeight = 'auto';
      this.imageWidth = '50%';
    }

    const img = new Image();
    img.onload = () => {
      const maxWidth = windowWidth * 0.9;
      const maxHeight = windowHeight * 0.4; 
      const widthRatio = maxWidth / img.width;
      const heightRatio = maxHeight / img.height;
      const ratio = Math.min(widthRatio, heightRatio);
      this.imageWidth = `${Math.round(img.width * ratio)}px`;
      this.imageHeight = `${Math.round(img.height * ratio)}px`;
    };
    img.src = this.imageUrl;
  }

  async updatePost()
  {

    if (!/^[\w\s.;,()?!]+$/.test(this.credentials.title) || !/^[\w\s.;,()?!]+$/.test(this.credentials.content)) {
      const alert = await this.alertController.create({
        header: 'Erreur',
        message: 'Caractères spéciaux non autorisés dans le champ',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }
    
    this.api.updateAdvices(this.credentials).subscribe(async res => {
      if (res && res.hasOwnProperty('id')) {
        const alert = await this.alertController.create({
          header: 'Succès',
          message: 'Modification faite !',
          buttons: [
            {
              text: 'Retourner à mon profil',
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