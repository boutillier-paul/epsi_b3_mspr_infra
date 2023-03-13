import { Component, forwardRef, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-form-advice',
  templateUrl: './form-advice.page.html',
  styleUrls: ['./form-advice.page.scss'],
})
export class FormAdvicePage implements OnInit {
  credentials = {
    title: '',
    content: '',
    photo: '',
  };
  selectedFile: {filename: string , data: string};

  constructor(
    public alertController: AlertController,
    private router: Router,
    @Inject(forwardRef(() => ApiService)) private api: ApiService,
  ) { }

  ngOnInit() {
  }

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          this.selectedFile = {
            filename: file.name,
            data: reader.result.toString().split(',')[1]
          };
        }
      };
      reader.readAsDataURL(file);
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop();
  
      console.log('Nom du fichier:', fileName);
      console.log('Extension du fichier:', fileExtension);
    }
  }

  async createPost() {

    if (!this.credentials.title) {
      const alert = await this.alertController.create({
        header: 'Attention',
        message: 'Veuillez insérer un titre à votre post avant de demander son ajout.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    if (!this.credentials.content) {
      const alert = await this.alertController.create({
        header: 'Attention',
        message: 'Veuillez insérer un contenu à votre post avant de demander son ajout.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    if (!this.selectedFile) {
      const alert = await this.alertController.create({
        header: 'Attention',
        message: 'Veuillez sélectionner une image de créer votre post.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }
    
    console.log(this.selectedFile);

    this.api.postPhoto(this.selectedFile).subscribe(async res => {
      if (res && res.hasOwnProperty('filename')) {
        this.credentials.photo = res.filename;
  
        this.api.postAdvices(this.credentials).subscribe(async res => {
          if (res && res.hasOwnProperty('created_at')) {
            const alert = await this.alertController.create({
              header: 'Succès',
              message: 'Votre post a été créé !',
              buttons: [
                {
                  text: 'Aller à la page d\'accueil',
                  handler: () => {
                    this.router.navigate(['/advices']);
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
            console.log('La réponse de l\'API ne contient ni le token ni l\'erreur');
            console.log(res);
          }
        });

      } else if (res && res.hasOwnProperty('detail')) {
        const alert = await this.alertController.create({
          header: 'Erreur',
          message: res.detail,
          buttons: ['OK']
        });
        await alert.present();
      } else {
        console.log('La réponse de l\'API ne contient ni le token ni l\'erreur');
        console.log(res);
      }
    })

    

  };
}
