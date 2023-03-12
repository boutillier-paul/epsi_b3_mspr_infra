import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormDeclarePage } from './form-declare.page';

const routes: Routes = [
  {
    path: '',
    component: FormDeclarePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormDeclarePageRoutingModule {}
