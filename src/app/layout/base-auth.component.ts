import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-base-auth',
  template: `
  <mat-drawer-container style='height:100% !important;'>
      <mat-drawer-content>
          <router-outlet></router-outlet>
      </mat-drawer-content>
  </mat-drawer-container>
  `
})
export class BaseAuthComponent implements OnInit {

  constructor() { }

  ngOnInit(): void { }

}
