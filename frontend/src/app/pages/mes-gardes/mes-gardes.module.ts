import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MesGardesPageRoutingModule } from './mes-gardes-routing.module';

import { MesGardesPage } from './mes-gardes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MesGardesPageRoutingModule
  ],
  declarations: [MesGardesPage]
})
export class MesGardesPageModule {}
