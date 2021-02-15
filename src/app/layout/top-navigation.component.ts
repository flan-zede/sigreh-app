import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/service/auth.service';

import { User } from 'src/app/model/user.model';

import { MENU_ITEM } from 'src/app/shared/constant/menu-item.constant';

@Component({
  selector: 'app-top-navigation',
  template: `
  <div class='d-flex justify-content-center'>
    <div *ngFor='let el of menu_item'>
      <button *ngIf='display(el.roles)' [class.mat-stroked-button]='selected(el.route)' [class.mat-button]='!selected(el.route)' (click)='router.navigate([el.route])'>
        <span>{{ el.name | translate }}</span>
      </button>
    </div>
  </div>
  `
})
export class TopNavigationComponent {

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
