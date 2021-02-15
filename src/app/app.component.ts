import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PwaService } from './service/pwa.service';

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
  ) { }

  ngOnInit(): void {
    this.pwa.swCheckForUpdate();
  }
}
