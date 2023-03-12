import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormGardePage } from './form-garde.page';

const routes: Routes = [
  {
    path: '',
    component: FormGardePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormGardePageRoutingModule {}
