import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HistoriqueSessionPage } from './historique-session.page';

const routes: Routes = [
  {
    path: '',
    component: HistoriqueSessionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistoriqueSessionPageRoutingModule {}
