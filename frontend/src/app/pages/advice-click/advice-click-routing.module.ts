import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdviceClickPage } from './advice-click.page';

const routes: Routes = [
  {
    path: '',
    component: AdviceClickPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdviceClickPageRoutingModule {}
