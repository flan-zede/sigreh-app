import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/service';
import { User } from 'src/app/model';
import { ROLE } from 'src/app/constant';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {

  user: User;
  readonly role = ROLE;

  constructor(
    public router: Router,
    public auth: AuthService
  ) {
    this.user = this.auth.getCredential()?.user;
  }

}
