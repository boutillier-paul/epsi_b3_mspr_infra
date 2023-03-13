import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MesPlantesPageRoutingModule } from './mes-plantes-routing.module';

import { MesPlantesPage } from './mes-plantes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MesPlantesPageRoutingModule
  ],
  declarations: [MesPlantesPage]
})
export class MesPlantesPageModule {}
