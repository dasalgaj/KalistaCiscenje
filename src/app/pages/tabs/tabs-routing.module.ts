import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'order',
        children: [
          {
            path: '',
            loadChildren: () => import('../order/order.module').then( m => m.OrderPageModule)
          },
          {
            path: 'sent-order',
            loadChildren: () => import('../sent-order/sent-order.module').then( m => m.SentOrderPageModule)
          },
          {
            path: 'login',
            loadChildren: () => import('../basic/login/login.module').then( m => m.LoginPageModule)
          },
          {
            path: 'order-form',
            loadChildren: () => import('../basic/order-form/order-form.module').then( m => m.OrderFormPageModule)
          }
        ]
      },
      {
        path: 'cleaning',
        loadChildren: () => import('../cleaning/cleaning.module').then( m => m.CleaningPageModule)
      },
      {
        path: 'price-list',
        loadChildren: () => import('../price-list/price-list.module').then( m => m.PriceListPageModule)
      },
      {
        path: 'contact',
        loadChildren: () => import('../contact/contact.module').then( m => m.ContactPageModule)
      },
      {
        path: 'profile',
        children: [
          {
            path: '',
            loadChildren: () => import('../profile/profile.module').then( m => m.ProfilePageModule)
          },
          {
            path: 'login',
            loadChildren: () => import('../basic/login/login.module').then( m => m.LoginPageModule)
          },
          {
            path: 'update-profile',
            loadChildren: () => import('../basic/update-profile/update-profile.module').then( m => m.UpdateProfilePageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/order',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/order',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
