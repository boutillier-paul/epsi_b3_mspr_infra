import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MesMessagesPage } from './mes-messages.page';

const routes: Routes = [
  {
    path: '',
    component: MesMessagesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MesMessagesPageRoutingModule {}
