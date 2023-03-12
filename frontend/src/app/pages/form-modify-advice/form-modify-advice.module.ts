import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormModifyAdvicePageRoutingModule } from './form-modify-advice-routing.module';

import { FormModifyAdvicePage } from './form-modify-advice.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormModifyAdvicePageRoutingModule
  ],
  declarations: [FormModifyAdvicePage]
})
export class FormModifyAdvicePageModule {}
