import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service';

import { JwtInterceptor } from './jwt.interceptor';

describe('JwtInterceptor', () => {
  let authService: AuthService;
  const routerMock = { navigate: jasmine.createSpy('navigate') };
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JwtInterceptor, { provide: Router, useValue: routerMock }]
    });
    authService = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    const interceptor: JwtInterceptor = TestBed.inject(JwtInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
