import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormGardePageRoutingModule } from './form-garde-routing.module';

import { FormGardePage } from './form-garde.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormGardePageRoutingModule
  ],
  declarations: [FormGardePage]
})
export class FormGardePageModule {}
