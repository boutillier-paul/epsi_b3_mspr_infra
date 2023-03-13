import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { S3Service } from 'src/app/services/s3.service';

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
  providers: [S3Service]
})
export class AdvicesPageRoutingModule {}
