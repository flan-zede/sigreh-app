import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Router } from '@angular/router';

import { AuthService } from 'src/app/service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(
    private auth: AuthService,
    public router: Router
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(catchError((err: any) => {
      if ([401, 403].indexOf(err.status) !== -1) {
        this.auth.logout();
        location.reload();
      }
      return throwError(err);
    }));
  }
}
