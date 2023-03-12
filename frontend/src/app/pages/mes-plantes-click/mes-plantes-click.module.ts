import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MesPlantesClickPageRoutingModule } from './mes-plantes-click-routing.module';

import { MesPlantesClickPage } from './mes-plantes-click.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MesPlantesClickPageRoutingModule
  ],
  declarations: [MesPlantesClickPage]
})
export class MesPlantesClickPageModule {}
