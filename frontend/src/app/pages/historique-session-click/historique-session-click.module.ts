import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HistoriqueSessionClickPageRoutingModule } from './historique-session-click-routing.module';

import { HistoriqueSessionClickPage } from './historique-session-click.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HistoriqueSessionClickPageRoutingModule
  ],
  declarations: [HistoriqueSessionClickPage]
})
export class HistoriqueSessionClickPageModule {}
