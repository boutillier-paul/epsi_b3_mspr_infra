import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormModifyAdvicePage } from './form-modify-advice.page';

const routes: Routes = [
  {
    path: '',
    component: FormModifyAdvicePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormModifyAdvicePageRoutingModule {}
