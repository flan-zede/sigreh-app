import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './shared/guard/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'client', pathMatch: 'full' },
  { path: 'city', loadChildren: () => import('./core/city/city.module').then(m => m.CityModule), canActivate: [AuthGuard] },
  { path: 'client', loadChildren: () => import('./core/client/client.module').then(m => m.ClientModule), canActivate: [AuthGuard] },
  {
    path: 'department', loadChildren: () => import('./core/department/department.module')
      .then(m => m.DepartmentModule), canActivate: [AuthGuard]
  },
  { path: 'district', loadChildren: () => import('./core/district/district.module').then(m => m.DistrictModule), canActivate: [AuthGuard] },
  {
    path: 'establishment', loadChildren: () => import('./core/establishment/establishment.module')
      .then(m => m.EstablishmentModule), canActivate: [AuthGuard]
  },
  { path: 'region', loadChildren: () => import('./core/region/region.module').then(m => m.RegionModule), canActivate: [AuthGuard] },
  {
    path: 'subprefecture', loadChildren: () => import('./core/subprefecture/subprefecture.module')
      .then(m => m.SubprefectureModule), canActivate: [AuthGuard]
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
