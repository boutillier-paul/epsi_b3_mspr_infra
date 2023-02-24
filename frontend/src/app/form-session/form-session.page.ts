import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-session',
  templateUrl: './form-session.page.html',
  styleUrls: ['./form-session.page.scss'],
})
export class FormSessionPage implements OnInit {
  sessionimgSrc: string = "";
  imageSelected = false;
  
  constructor( private alertController: AlertController, private router: Router ) { }

  ngOnInit() {
  }
  

  onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement && inputElement.files && inputElement.files.length > 0) {
      const file: File = inputElement.files[0];

      if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.sessionimgSrc = reader.result as string;
          localStorage.setItem('sessionimgSrc', this.sessionimgSrc);
          this.imageSelected = true;
        };
      }
    }
  }

  async envoyer() {
    if (!this.imageSelected) {
      const alert = await this.alertController.create({
        header: 'Attention',
        message: 'Veuillez sélectionner une image d\'envoyer votre session.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }
  
    const now = new Date();
    const dateString = now.toLocaleDateString('fr-FR');
    localStorage.setItem('dateSession', dateString);
  
    // Code pour traiter les données
  
    const alert = await this.alertController.create({
      header: 'Session envoyée',
      message: 'Votre session a été envoyée.',
      buttons: ['OK']
    });
    await alert.present();
  
    this.router.navigate(['/map']);
  }
}
