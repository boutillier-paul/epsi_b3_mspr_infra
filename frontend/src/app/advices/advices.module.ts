import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdvicesPageRoutingModule } from './advices-routing.module';

import { AdvicesPage } from './advices.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdvicesPageRoutingModule
  ],
  declarations: [AdvicesPage]
})
export class AdvicesPageModule {}
