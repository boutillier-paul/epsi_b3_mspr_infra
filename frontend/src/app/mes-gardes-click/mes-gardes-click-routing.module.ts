import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MesGardesClickPage } from './mes-gardes-click.page';

const routes: Routes = [
  {
    path: '',
    component: MesGardesClickPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MesGardesClickPageRoutingModule {}
