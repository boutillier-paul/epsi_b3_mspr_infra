import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MesPlantesGardesPage } from './mes-plantes-gardes.page';

const routes: Routes = [
  {
    path: '',
    component: MesPlantesGardesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MesPlantesGardesPageRoutingModule {}
