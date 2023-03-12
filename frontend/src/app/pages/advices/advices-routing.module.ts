import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdvicesPage } from './advices.page';

const routes: Routes = [
  {
    path: '',
    component: AdvicesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdvicesPageRoutingModule {}
