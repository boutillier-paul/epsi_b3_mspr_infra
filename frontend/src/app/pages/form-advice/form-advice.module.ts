import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormAdvicePageRoutingModule } from './form-advice-routing.module';

import { FormAdvicePage } from './form-advice.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormAdvicePageRoutingModule
  ],
  declarations: [FormAdvicePage]
})
export class FormAdvicePageModule {}
