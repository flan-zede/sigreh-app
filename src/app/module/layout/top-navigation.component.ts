import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/service';
import { MENU_ITEMS } from 'src/app/constant';
import { Permission } from 'src/app/enum';
import { MenuItemsInterface } from 'src/app/interface';

@Component({
  selector: 'app-top-navigation',
  template: `
  <div class='d-flex justify-content-center overflow-auto'>
    <div *ngFor='let p of items'>
        <button [class.mat-stroked-button]='p.selected' [class.mat-button]='!p.selected' (click)='router.navigate([p.path])'>
          <span>{{ p.name | translate }}</span>
        </button>
    </div>
  </div>
  `
})
export class TopNavigationComponent implements OnInit{

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
