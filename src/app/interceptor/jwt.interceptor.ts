import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

import { AuthService } from '../service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(
    private auth: AuthService,
    public router: Router
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const credential = this.auth.getCredential();
    if (request.url.match(environment.api) && credential?.jwt) {
      request = request.clone({ setHeaders: { Authorization: `Bearer ${credential?.jwt}` } });
    }

    return next.handle(request);
  }
}
