import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/model';

import { AuthService } from 'src/app/service';

@Component({
  selector: 'app-layout-header',
  templateUrl: './layout-header.component.html'
})
export class LayoutHeaderComponent {

  @Output() toggle: EventEmitter<any> = new EventEmitter();
  user: User;

  constructor(
    public router: Router,
    public auth: AuthService
  ) {
    this.user = this.auth.getCredential()?.user;
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['auth']);
  }

  toggleSideBar(): void {
    this.toggle.emit();
    setTimeout(() => { window.dispatchEvent(new Event('resize')); }, 1000);
  }

}
