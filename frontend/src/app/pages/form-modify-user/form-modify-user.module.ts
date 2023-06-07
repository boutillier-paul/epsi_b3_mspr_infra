import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormModifyUserPageRoutingModule } from './form-modify-user-routing.module';

import { FormModifyUserPage } from './form-modify-user.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormModifyUserPageRoutingModule
  ],
  declarations: [FormModifyUserPage]
})
export class FormModifyUserPageModule {}
