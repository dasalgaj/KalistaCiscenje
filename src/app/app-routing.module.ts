import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ReadyPageGuard } from './guards/ready-page.guard';


const routes: Routes = [
  {
    path: 'tabs',
    loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule),
    canLoad: [ReadyPageGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/basic/login/login.module').then( m => m.LoginPageModule),
    canLoad: [ReadyPageGuard]
  },
  {
    path: 'update-profile',
    loadChildren: () => import('./pages/basic/update-profile/update-profile.module').then( m => m.UpdateProfilePageModule),
    canLoad: [ReadyPageGuard]
  },
  {
    path: 'add-car',
    loadChildren: () => import('./pages/basic/add-car/add-car.module').then( m => m.AddCarPageModule),
    canLoad: [ReadyPageGuard]
  },
  {
    path: 'add-car/:id',
    loadChildren: () => import('./pages/basic/add-car/add-car.module').then( m => m.AddCarPageModule),
    canLoad: [ReadyPageGuard]
  },
  {
    path: 'order-form',
    loadChildren: () => import('./pages/basic/order-form/order-form.module').then( m => m.OrderFormPageModule),
    canLoad: [ReadyPageGuard]
  },
  {
    path: 'order-chemical-form',
    loadChildren: () => import('./pages/basic/order-chemical-form/order-chemical-form.module').then( m => m.OrderChemicalFormPageModule),
    canLoad: [ReadyPageGuard]
  },
  {
    path: '',
    redirectTo: 'tabs',
    pathMatch: 'full'
  },
  {
    path: 'cleaning',
    loadChildren: () => import('./pages/cleaning/cleaning.module').then( m => m.CleaningPageModule)
  },
  {
    path: 'sent-order',
    loadChildren: () => import('./pages/sent-order/sent-order.module').then( m => m.SentOrderPageModule)
  }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
