import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import * as signalR from '@microsoft/signalr';

import { User, Notification } from 'src/app/model';
import { ApiService, AuthService } from 'src/app/service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-layout-header',
  templateUrl: './layout-header.component.html'
})
export class LayoutHeaderComponent implements OnInit {

  @Output() toggle: EventEmitter<any> = new EventEmitter();
  load: boolean;
  user: User;
  notificationCount = 0;
  private hubConnection: signalR.HubConnection;

  constructor(
    public router: Router,
    public auth: AuthService,
    public api: ApiService
  ) {
    this.user = this.auth.getCredential()?.user;
  }

  ngOnInit(): void {
    this.readNotifications();
    this.hubConnection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Information).withUrl(`${environment.api}/notificationhub`).build();
    this.hubConnection.start().then().catch(err => console.log('hubConnection Error: ' + err));
    this.hubConnection.on('notification', () => this.notificationCount++);
  }

  readNotifications(): void {
    this.load = true;
    this.api.get('notification/count')
      .pipe(finalize(() => this.load = false))
      .subscribe((count: number) => this.notificationCount = count);
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
