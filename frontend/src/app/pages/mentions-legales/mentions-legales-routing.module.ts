import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MentionsLegalesPage } from './mentions-legales.page';

const routes: Routes = [
  {
    path: '',
    component: MentionsLegalesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MentionsLegalesPageRoutingModule {}
