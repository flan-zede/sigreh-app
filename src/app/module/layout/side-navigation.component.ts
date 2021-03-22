import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/service';
import { MENU_ITEMS } from 'src/app/constant';
import { Permission } from 'src/app/enum';

@Component({
  selector: 'app-side-navigation',
  template: `
  <mat-nav-list>
    <h4 mat-list-item class='text-center'>MENU</h4>
    <mat-divider></mat-divider>
    <div *ngFor='let el of items'>
      <a mat-list-item>
        <mat-icon *ngIf='el.icon'>{{ el.icon }}</mat-icon>&nbsp;{{ el.name | translate }}
        <mat-divider></mat-divider>
      </a>
    </div>
  </mat-nav-list>
  `
})
export class SideNavigationComponent implements OnInit{

  readonly menuItems = MENU_ITEMS;
  items = [];

  constructor(
    public router: Router,
    public auth: AuthService
  ) {}

  ngOnInit(): void{
    this.menuItems.forEach(p => {
      if (this.auth.checkPermission(p.path, Permission.Read)){
        if (this.router.url.indexOf(p.path) > -1) { p.selected = true; }
        else { p.selected = false; }
        this.items.push(p);
      }
    });
  }
}
