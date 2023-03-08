import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SentOrderPageRoutingModule } from './sent-order-routing.module';

import { SentOrderPage } from './sent-order.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SentOrderPageRoutingModule,
    TranslateModule,
    ReactiveFormsModule
  ],
  declarations: [SentOrderPage]
})
export class SentOrderPageModule {}
