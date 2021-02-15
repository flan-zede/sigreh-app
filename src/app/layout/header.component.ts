import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { AuthService } from 'src/app/service/auth.service';

import { User } from 'src/app/model/user.model';

@Component({
  selector: 'app-header',
  template: `
  <mat-toolbar color='primary'>
    <mat-toolbar-row>
        <div class='w-100 d-flex'>
            <button mat-button (click)='router.navigate(["/"])'>
                <img src='assets/icons/logo.png' height='38' class='mr-2'/>
                <span>SIGREH</span>
            </button>
            <button mat-button (click)='toggleSideBar()'>
                <mat-icon>apps</mat-icon>
            </button>
            <div class='d-flex flex-grow-1'>
                <div class='d-flex flex-grow-1 justify-content-end'>
                    <div>
                        <button mat-button [matMenuTriggerFor]='languageMenu'>
                            <mat-icon>outlined_flag</mat-icon> {{ 'language'|translate }} : {{ trans.currentLang }}
                        </button>
                        <mat-menu #languageMenu='matMenu'>
                            <span mat-menu-item *ngFor='let lang of trans.getLangs()' (click)='trans.use(lang)'>
                              {{ lang }}
                              <mat-divider></mat-divider>
                            </span>
                        </mat-menu>
                        <button mat-button [matMenuTriggerFor]='userMenu'>
                            <mat-icon>person_outline</mat-icon> {{ user?.username }}
                        </button>
                        <mat-menu #userMenu='matMenu'>
                            <span mat-menu-item (click)='logout()' color='warn'>{{ 'logout'|translate }}</span>
                        </mat-menu>
                    </div>
                </div>
            </div>
        </div>
    </mat-toolbar-row>
</mat-toolbar>
<mat-toolbar>
    <mat-toolbar-row>
        <app-top-navigation class='w-100'></app-top-navigation>
    </mat-toolbar-row>
</mat-toolbar>
`
})
export class HeaderComponent {

  public user: User;
  @Output() toggle: EventEmitter<any> = new EventEmitter();

  constructor(
    public router: Router,
    public trans: TranslateService,
    public auth: AuthService
  ) {
    this.user = this.auth.getCredential()?.user;
    trans.addLangs(['en', 'fr']);
    trans.setDefaultLang('en');
    trans.use(trans.getBrowserLang().match(/en|fr/) ? trans.getBrowserLang() : 'fr');
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['auth']);
  }

  toggleSideBar(): void {
    this.toggle.emit();
    setTimeout(() => { window.dispatchEvent(new Event('resize')); }, 1000);
  }

  setLanguage(lang: string) {
    this.trans.setDefaultLang(lang);
    this.trans.use(lang);
  }

}