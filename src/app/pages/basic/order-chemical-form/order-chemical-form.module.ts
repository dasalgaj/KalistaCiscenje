import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrderChemicalFormPageRoutingModule } from './order-chemical-form-routing.module';

import { OrderChemicalFormPage } from './order-chemical-form.page';

import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrderChemicalFormPageRoutingModule,
    ReactiveFormsModule,
    TranslateModule,
    ComponentsModule
  ],
  declarations: [OrderChemicalFormPage]
})
export class OrderChemicalFormPageModule {}
