import { Component } from '@angular/core';

@Component({
  selector: 'app-layout-default',
  templateUrl: './layout-default.component.html'
})
export class LayoutDefaultComponent {

  sideBarOpen = false;

  sideBarToggler(): void {
    this.sideBarOpen = !this.sideBarOpen;
  }

}
