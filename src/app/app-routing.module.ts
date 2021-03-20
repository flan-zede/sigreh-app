import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './shared/guard';

const routes: Routes = [
  { path: '', redirectTo: 'client', pathMatch: 'full' },
  { path: 'city', loadChildren: () => import('./core/city/city.module').then(m => m.CityModule), canActivate: [AuthGuard] },
  { path: 'client', loadChildren: () => import('./core/client/client.module').then(m => m.ClientModule), canActivate: [AuthGuard] },
  {
    path: 'establishment', loadChildren: () => import('./core/establishment/establishment.module')
      .then(m => m.EstablishmentModule), canActivate: [AuthGuard]
  },
  { path: 'user', loadChildren: () => import('./core/_default/user/user.module').then(m => m.UserModule), canActivate: [AuthGuard] },
  { path: 'auth', loadChildren: () => import('./core/_default/auth/auth.module').then(m => m.AuthModule) },
  { path: '**', loadChildren: () => import('./core/_default/error/error.module').then(m => m.ErrorModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
