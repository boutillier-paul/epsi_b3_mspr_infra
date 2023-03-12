import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormAdvicePage } from './form-advice.page';

const routes: Routes = [
  {
    path: '',
    component: FormAdvicePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormAdvicePageRoutingModule {}
