import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MesPlantesPage } from './mes-plantes.page';

const routes: Routes = [
  {
    path: '',
    component: MesPlantesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MesPlantesPageRoutingModule {}
