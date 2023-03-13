import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdviceClickPageRoutingModule } from './advice-click-routing.module';

import { AdviceClickPage } from './advice-click.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdviceClickPageRoutingModule
  ],
  declarations: [AdviceClickPage]
})
export class AdviceClickPageModule {}
