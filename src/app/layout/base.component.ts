import { Component } from '@angular/core';

@Component({
  selector: 'app-base',
  template: `
  <app-header (toggle)='sideBarToggler()'></app-header>
  <mat-drawer-container>
      <mat-drawer mode='over' [opened]='sideBarOpen'>
          <app-side-navigation></app-side-navigation>
      </mat-drawer>
      <mat-drawer-content>
        <router-outlet></router-outlet>
      </mat-drawer-content>
  </mat-drawer-container>
  `
})
export class BaseComponent {

  sideBarOpen = false;

  sideBarToggler(): void {
    this.sideBarOpen = !this.sideBarOpen;
  }

}
