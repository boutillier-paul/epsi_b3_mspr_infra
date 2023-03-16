import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MentionsLegalesPageRoutingModule } from './mentions-legales-routing.module';

import { MentionsLegalesPage } from './mentions-legales.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MentionsLegalesPageRoutingModule
  ],
  declarations: [MentionsLegalesPage]
})
export class MentionsLegalesPageModule {}
