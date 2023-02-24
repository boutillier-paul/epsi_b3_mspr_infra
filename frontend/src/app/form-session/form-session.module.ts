import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormSessionPageRoutingModule } from './form-session-routing.module';

import { FormSessionPage } from './form-session.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormSessionPageRoutingModule
  ],
  declarations: [FormSessionPage]
})
export class FormSessionPageModule {}
