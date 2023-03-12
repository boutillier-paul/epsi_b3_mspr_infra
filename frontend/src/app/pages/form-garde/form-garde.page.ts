import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-garde',
  templateUrl: './form-garde.page.html',
  styleUrls: ['./form-garde.page.scss'],
})
export class FormGardePage implements OnInit {
  showStartDatePickerFlag: boolean = false;
  showEndDatePickerFlag: boolean = false;
  dateDebut: string = '';
  dateFin: string = '';
  showStartButton: boolean = false;
  showEndButton: boolean = false;
  verif: boolean = false;
  planteSelected: string = "";
  
  constructor( private alertController: AlertController, private router: Router ) { }

  showStartDatePicker() {
    this.showStartDatePickerFlag = true;
    this.showStartButton = true;
  }
  showEndDatePicker() {
    this.showEndDatePickerFlag= true;
    this.showEndButton = true;
  }

  onStartDateSelected() {
    const startDateInput = document.getElementsByName('dateDebut')[0] as HTMLInputElement;
    startDateInput.value = this.dateDebut;
    this.showStartDatePickerFlag = false;
    this.showStartButton = false;
  }

  onEndDateSelected() {
    const endDateInput = document.getElementsByName('dateFin')[0] as HTMLInputElement;
    endDateInput.value = this.dateFin;
    this.showEndDatePickerFlag = false;
    this.showEndButton = false;
  }

  hideStartDatePicker() {
    this.showStartDatePickerFlag = false;
  }

  hideEndDatePicker() {
    this.showEndDatePickerFlag = false;
  }

  onButtonStartClick() 
  {
    this.showStartDatePickerFlag = false;
    this.showStartButton = false;
  }

  onButtonEndClick() 
  {
    this.showEndDatePickerFlag = false;
    this.showEndButton = false;
  }

  ngOnInit() {
  }

  async declare() {


    if (!this.planteSelected) {
      const alert = await this.alertController.create({
        header: 'Attention',
        message: 'Veuillez sélectionner une plante avant de faire votre demande.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    if (this.dateFin == "" || this.dateDebut == "") {
      const alert = await this.alertController.create({
        header: 'Erreur',
        message: 'Les deux dates doivent être choisis ',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    if (this.dateFin <= this.dateDebut) {
      const alert = await this.alertController.create({
        header: 'Erreur',
        message: 'La date de fin ne peut pas être plus tôt ou égale à la date de début !!',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    const now = new Date();
    const dateString = now.toLocaleDateString('fr-FR');

    const alert = await this.alertController.create({
      header: 'Succès',
      message: 'Votre demande à été validé !',
      buttons: ['OK'],
    });
    await alert.present();
      
    this.router.navigate(['/mes-plantes']);
  }
  // POST /guards/ 
  // POST //  
}
