import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HistoriqueSessionPageRoutingModule } from './historique-session-routing.module';

import { HistoriqueSessionPage } from './historique-session.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HistoriqueSessionPageRoutingModule
  ],
  declarations: [HistoriqueSessionPage]
})
export class HistoriqueSessionPageModule {}
