import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HistoriqueSessionClickPage } from './historique-session-click.page';

const routes: Routes = [
  {
    path: '',
    component: HistoriqueSessionClickPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistoriqueSessionClickPageRoutingModule {}
