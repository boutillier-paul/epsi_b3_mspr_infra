import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MesGardesPage } from './mes-gardes.page';

const routes: Routes = [
  {
    path: '',
    component: MesGardesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MesGardesPageRoutingModule {}
