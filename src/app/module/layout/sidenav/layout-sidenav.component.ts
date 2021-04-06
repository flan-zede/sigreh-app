import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MENU_ITEMS } from 'src/app/constant';
import { Permission } from 'src/app/enum';
import { AuthService } from 'src/app/service';

@Component({
  selector: 'app-layout-sidenav',
  templateUrl: './layout-sidenav.component.html'
})
export class LayoutSidenavComponent implements OnInit{

  menuItems = MENU_ITEMS;
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
