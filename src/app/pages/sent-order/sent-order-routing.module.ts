import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SentOrderPage } from './sent-order.page';

const routes: Routes = [
  {
    path: '',
    component: SentOrderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SentOrderPageRoutingModule {}
