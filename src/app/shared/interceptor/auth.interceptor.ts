import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { AuthService } from 'src/app/service/auth.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private auth: AuthService,
    public router: Router
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const credential = this.auth.getCredential();
    if (request.url.match(environment.api) && credential?.jwt) {
      request = request.clone({ setHeaders: { Authorization: `Bearer ${credential?.jwt}` } });
    }

    return next.handle(request)
      .pipe(
        tap(
          (event: HttpEvent<any>) => { },
          (err: any) => {
            if (err instanceof HttpErrorResponse) {
              if (err.status === 401) {
                this.auth.logout();
                this.router.navigate(['auth']);
              }
            }
          }
        )
      );
  }
}
