import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from 'src/app/service';

@Injectable({ providedIn: 'root' })
export class FeatureGuard implements CanActivate {

    constructor(
        private router: Router,
        private auth: AuthService
    ) { }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot)
        : Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        if (this.auth.checkPermission(next.data.feature, next.data.permission)) { return true; }
        this.router.navigate(['error/403']);
        return false;
    }

}
