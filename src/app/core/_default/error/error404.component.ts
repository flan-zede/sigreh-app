import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-error-404',
  template: `
  <div class='d-flex justify-content-center align-items-center h-100'>
    <div class='d-flex flex-column'>
        <div class='d-flex justify-content-center mb-2'>
            <img src='assets/icons/icon-72x72.png' />
        </div>
        <div class='text-center'>
          <h1 class="display-1 d-block">404</h1>
          <div class="mb-4 lead">{{ 'error.404'|translate }}</div>
          <a color='primary' [routerLink]="['']">{{ 'back_to_home'|translate }}</a>
        </div>
    </div>
  </div>
`
})
export class Error404Component {

  constructor() { }

}
