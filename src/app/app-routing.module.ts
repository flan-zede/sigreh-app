import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', loadChildren: () => import('./module/dashboard/dashboard.module').then(m => m.DashboardModule) },
  { path: 'auth', loadChildren: () => import('./module/auth/auth.module').then(m => m.AuthModule) },
  { path: 'error', loadChildren: () => import('./module/error/error.module').then(m => m.ErrorModule) },
  { path: 'city', loadChildren: () => import('./module/core/city/city.module').then(m => m.CityModule) },
  { path: 'client', loadChildren: () => import('./module/core/client/client.module').then(m => m.ClientModule) },
  { path: 'establishment', loadChildren: () =>
  import('./module/core/establishment/establishment.module').then(m => m.EstablishmentModule) },
  { path: 'user', loadChildren: () => import('./module/user/user.module').then(m => m.UserModule) },
  { path: '**', loadChildren: () => import('./module/error/error.module').then(m => m.ErrorModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
