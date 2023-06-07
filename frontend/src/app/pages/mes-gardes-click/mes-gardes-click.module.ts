import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MesGardesClickPageRoutingModule } from './mes-gardes-click-routing.module';

import { MesGardesClickPage } from './mes-gardes-click.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MesGardesClickPageRoutingModule
  ],
  declarations: [MesGardesClickPage]
})
export class MesGardesClickPageModule {}
