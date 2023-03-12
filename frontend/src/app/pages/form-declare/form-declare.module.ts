import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormDeclarePageRoutingModule } from './form-declare-routing.module';

import { FormDeclarePage } from './form-declare.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormDeclarePageRoutingModule
  ],
  declarations: [FormDeclarePage]
})
export class FormDeclarePageModule {}
