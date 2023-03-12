import { Component, forwardRef, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api/api.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';

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
  selectedFile: File;

  constructor(
    public alertController: AlertController,
    private router: Router,
    @Inject(forwardRef(() => ApiService)) private api: ApiService,
    private storage: AngularFireStorage
  ) { }

  ngOnInit() {
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.selectedFile = file;

    const fileName = file.name;
    const fileExtension = fileName.split('.').pop();

    console.log('Nom du fichier:', fileName);
    console.log('Extension du fichier:', fileExtension);

    this.credentials.photo = fileName + '.' + fileExtension;
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

    const filePath = `advices/${this.selectedFile.name}`;
    const fileRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, this.selectedFile);

    uploadTask.snapshotChanges().subscribe(async () => {
      const downloadURL = await fileRef.getDownloadURL().toPromise();
      this.credentials.photo = downloadURL;

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
    });
  }
}