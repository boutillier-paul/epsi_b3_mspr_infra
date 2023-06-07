import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormModifyUserPage } from './form-modify-user.page';

const routes: Routes = [
  {
    path: '',
    component: FormModifyUserPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormModifyUserPageRoutingModule {}
