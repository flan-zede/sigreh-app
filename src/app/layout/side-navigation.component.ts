import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/service/auth.service';

import { User } from 'src/app/model/user.model';

import { MENU_ITEM } from 'src/app/shared/constant/menu-item.constant';

@Component({
  selector: 'app-side-navigation',
  template: `
  <mat-nav-list>
    <h4 mat-list-item class='text-center'>MENU</h4>
    <mat-divider></mat-divider>
    <div *ngFor='let el of menu_item'>
      <a mat-list-item *ngIf='display(el.roles)'>
        <mat-icon *ngIf='el.icon'>{{ el.icon }}</mat-icon>&nbsp;{{ el.name | translate }}
        <mat-divider></mat-divider>
      </a>
    </div>
  </mat-nav-list>
  `
})
export class SideNavigationComponent {

  readonly menu_item = MENU_ITEM;
  user: User;

  constructor(
    public router: Router,
    private auth: AuthService
  ) { 
    this.user = this.auth.getCredential().user;
  }

  selected(route: string): boolean {
    return this.router.url.indexOf(route) > -1;
  }

  display(roles: string[]){
    return roles.includes(this.user.role);
  }

}
