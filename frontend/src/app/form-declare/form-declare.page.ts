import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-declare',
  templateUrl: './form-declare.page.html',
  styleUrls: ['./form-declare.page.scss'],
})
export class FormDeclarePage implements OnInit {
  imageSrc: string = "";

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
          this.imageSrc = reader.result as string;
          localStorage.setItem('imageSrc', this.imageSrc);
        };
      }
    }
  }
  async declarer() {
    if (!this.imageSrc) {
      const alert = await this.alertController.create({
        header: 'Attention',
        message: 'Veuillez sélectionner une image de déclarer votre plante.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    const speciesInput = document.getElementsByName('species')[0] as HTMLInputElement;

    if (!speciesInput.value) {
      const alert = await this.alertController.create({
        header: 'Attention',
        message: 'Veuillez insérer l\'espèce de la plante avant de la déclarer.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    const nameInput = document.getElementsByName('name')[0] as HTMLInputElement;

    if (!nameInput.value) {
      const alert = await this.alertController.create({
        header: 'Attention',
        message: 'Veuillez insérer le nom de la plante avant de la déclarer.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }
  
    // Code pour traiter les données
  
    const alert = await this.alertController.create({
      header: 'Déclaration valide',
      message: 'Votre plante a été déclarée.',
      buttons: ['OK']
    });
    await alert.present();
  
    this.router.navigate(['/mes-plantes']);
  }
  // Post /plants/
}
