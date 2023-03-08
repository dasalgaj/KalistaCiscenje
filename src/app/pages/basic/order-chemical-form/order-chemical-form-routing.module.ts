import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderChemicalFormPage } from './order-chemical-form.page';

const routes: Routes = [
  {
    path: '',
    component: OrderChemicalFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderChemicalFormPageRoutingModule {}
