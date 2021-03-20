import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PwaService } from './service';

@Component({
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>
  `
})
export class AppComponent implements OnInit {

  constructor(
    private pwa: PwaService,
    public trans: TranslateService
  ) { 
    trans.addLangs(['en', 'fr']);
    trans.setDefaultLang('en');
    trans.use(trans.getBrowserLang().match(/en|fr/) ? trans.getBrowserLang() : 'fr');
  }

  ngOnInit(): void {
    this.pwa.swCheckForUpdate();
  }
}
