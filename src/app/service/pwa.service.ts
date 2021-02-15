import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { interval, Subscription } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PwaService {

  updateSubscription: Subscription;

  constructor(public swUpdate: SwUpdate) { }

  swCheckForUpdate(): void {
    this.updateSubscription = this.swUpdate.available
      .subscribe(() => this.swUpdate.activateUpdate().then(() => window.location.reload()));

    if (this.swUpdate.isEnabled) {
      this.swUpdate.activateUpdate();
      interval(60 * 60 * 1000).subscribe(() => this.swUpdate.checkForUpdate().then(() => console.log('checking for update')));
    }
  }

}
