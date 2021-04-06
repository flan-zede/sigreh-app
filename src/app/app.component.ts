import { Component, OnInit } from '@angular/core';
import { PwaService } from './service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  constructor(
    private pwa: PwaService
  ) { }

  ngOnInit(): void {
    this.pwa.swCheckForUpdate();
  }

}
