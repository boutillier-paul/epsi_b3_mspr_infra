import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ChunkPipe } from 'src/app/pipes/chunk/chunk.pipe';
import { AdvicesPageRoutingModule } from './advices-routing.module';
import { FilterPipe } from 'src/app/pipes/filter/filter.pipe';
import { AdvicesPage } from './advices.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdvicesPageRoutingModule
  ],
  declarations: [AdvicesPage, ChunkPipe, FilterPipe]
})
export class AdvicesPageModule {}
