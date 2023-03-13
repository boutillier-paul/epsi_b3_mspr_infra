import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MesPlantesClickPage } from './mes-plantes-click.page';

const routes: Routes = [
  {
    path: '',
    component: MesPlantesClickPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MesPlantesClickPageRoutingModule {}
