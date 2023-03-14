import { Component, forwardRef, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api/api.service';

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
  planteSelected: number | undefined;
  plants: any[] = [];
  
  constructor(
    public alertController: AlertController,
    private router: Router,
    @Inject(forwardRef(() => ApiService)) private api: ApiService
  ) { }

  saveSelectedPlantId() {
    const selectedPlant = this.plants.find(plant => plant.id === this.planteSelected);
    if (selectedPlant) {
      localStorage.setItem('selectedPlantId', selectedPlant.id.toString());
    }
  }

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
    this.api.checkToken();
    this.api.getyouruser().subscribe((data) => {
      this.plants = data.plants;
    });
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

    this.api.postGuard(this.dateDebut, this.dateFin).subscribe(async (response) => {
      if (response.created_at) {
        const alert = await this.alertController.create({
          header: 'Succès',
          message: 'Votre demande a été validée !',
          buttons: ['OK'],
        });
        await alert.present();
        this.router.navigate(['/mes-plantes']);
      } else if (response.detail) {
        const alert = await this.alertController.create({
          header: 'Erreur',
          message: response.detail,
          buttons: ['OK'],
        });
        await alert.present();
      } else {
        const alert = await this.alertController.create({
          header: 'Erreur Inconnue',
          message: 'Une erreur inconnue est survenue.',
          buttons: ['OK'],
        });
        await alert.present();
      }
    });
  } 
}
