import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { OrderByPipe } from 'src/app/pipes/orderBy/orderBy.pipe';
import { MesMessagesPageRoutingModule } from './mes-messages-routing.module';

import { MesMessagesPage } from './mes-messages.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MesMessagesPageRoutingModule
  ],
  declarations: [MesMessagesPage, OrderByPipe]
})
export class MesMessagesPageModule {}
