import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormSessionPage } from './form-session.page';

const routes: Routes = [
  {
    path: '',
    component: FormSessionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormSessionPageRoutingModule {}
