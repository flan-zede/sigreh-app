import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/service';
import { User } from 'src/app/model';
import { ROLE } from 'src/app/constant';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class='d-flex justify-content-center align-items-center h-100 w-100'>
      <div class='d-flex flex-column'>
        <div class='text-center'>
          <h1 class='mb-2'>Bienvenue <b>{{ user.name }}</b></h1>
        </div>
        <div class='text-center mb-4'>
          <h3 class='mb-2'>Vous êtes</h3>
          <h1 class='mb-2'><b><span *ngFor='let p of role'><span *ngIf='p.id == user.role'>{{ p.name }}</span></span></b></h1>
        </div>
        <div class='d-flex justify-content-center'>
          <button mat-stroked-button color='primary' (click)='router.navigate(["/client"])'>Consulter la liste des clients</button>
        </div>
      </div>
    </div>
`
})
export class DashboardComponent implements OnInit {

  user: User;
  readonly role = ROLE;

  constructor(
    public router: Router,
    public auth: AuthService
  ) {
    this.user = this.auth.getCredential()?.user;
  }

  ngOnInit(): void {
  }

}
