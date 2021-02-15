import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AlertService } from 'src/app/service/alert.service';

import { AuthService } from 'src/app/service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserRoleGuard implements CanActivate {

  constructor(
    private alert: AlertService,
    private auth: AuthService
  ) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot)
    : Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const user = this.auth.getCredential()?.user;
    if (user && next.data && next.data.roles && next.data.roles.includes(user.role)) return true;
    this.alert.info('You don\'t have access to this route');
    return false;
  }

}
