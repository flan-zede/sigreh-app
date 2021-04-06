import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize, first } from 'rxjs/operators';

import { ApiService, AuthService } from 'src/app/service';
import { AuthResponseInterface } from 'src/app/interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {

  hide: boolean;
  load: boolean;
  form: FormGroup;

  constructor(
    public fb: FormBuilder,
    public router: Router,
    public auth: AuthService,
    public api: ApiService
  ) {
    this.form = this.fb.group({
      username: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(45)])],
      password: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(45)])]
    });
    this.hide = true;
  }

  login(): void {
    this.load = true;
    this.api.post('user/login', this.form.value).pipe(first(), finalize(() => this.load = false))
      .subscribe((p: AuthResponseInterface) => {
        this.auth.setCredential(p);
        this.router.navigate(['dashboard']);
      });
  }

}
