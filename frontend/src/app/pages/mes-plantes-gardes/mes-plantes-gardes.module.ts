import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MesPlantesGardesPageRoutingModule } from './mes-plantes-gardes-routing.module';

import { MesPlantesGardesPage } from './mes-plantes-gardes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MesPlantesGardesPageRoutingModule
  ],
  declarations: [MesPlantesGardesPage]
})
export class MesPlantesGardesPageModule {}
