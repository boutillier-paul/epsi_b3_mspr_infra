import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { MentionsLegalesPageRoutingModule } from './mentions-legales-routing.module';

import { MentionsLegalesPage } from './mentions-legales.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxExtendedPdfViewerModule,
    MentionsLegalesPageRoutingModule
  ],
  declarations: [MentionsLegalesPage]
})
export class MentionsLegalesPageModule {}
