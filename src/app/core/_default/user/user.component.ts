import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { AuthService, CrudService } from 'src/app/service';
import { User } from 'src/app/model';
import { USER_ROLE } from 'src/app/shared/constant';

@Component({
  selector: 'app-user',
  template: `
    <app-search-bar (return)='read()' (query)='search($event)'></app-search-bar>
    <app-view-option [ability]='auth.ability()' [count]='items.length' [route]='crud.route' [load]='crud.load'></app-view-option>

    <div *ngIf='items.length > 0'>
      <div class='row'>
        <div class='col-lg-12' *ngFor='let item of items; trackBy: crud.trackFn'>
          <div class='d-flex mat-card mb-2 p-2'>
            <div class='flex-grow-1' (click)='router.navigate([crud.route.path + "/show", item.id])'>
              <span class='font-weight-bold'>{{ item.firstname }} {{ item.name }} </span> . {{ item.username }}
              <div> 
                <mat-icon inline='true'>email</mat-icon> {{ item.email }}
                <mat-icon inline='true'>phone</mat-icon> {{ item.phone }}
              </div>
              <span *ngFor='let p of user_role'><span *ngIf='p.id == item.role'>{{ p.name }}</span></span>
              <div *ngIf='["DRMT"].includes(item.role)'>
                <mat-chip-list>
                  <mat-chip *ngFor='let p of item.regions'>{{ p.name }}</mat-chip>
                </mat-chip-list>
              </div>
              <div *ngIf='["DDMT","PP"].includes(item.role)'>
                <mat-chip-list>
                  <mat-chip *ngFor='let p of item.departments'>{{ p.name }}</mat-chip>
                </mat-chip-list>
              </div>
              <div *ngIf='["REH","GEH"].includes(item.role)'>
                <mat-chip-list>
                  <mat-chip *ngFor='let p of item.establishments'>{{ p.name }}</mat-chip>
                </mat-chip-list>
              </div>
            </div>
            <div class='d-flex flex-column'>
              <mat-icon [matMenuTriggerFor]='optionMenu'>more_horiz</mat-icon>
              <mat-menu #optionMenu='matMenu'>
                <span mat-menu-item (click)='router.navigate([crud.route.path + "/edit", item.id])'><mat-icon>edit</mat-icon>{{ 'edit'|translate}}</span>
                <span mat-menu-item (click)='delete(item.id)'><mat-icon>delete</mat-icon>{{ 'delete'|translate}}</span>
              </mat-menu>
              <small class='text-muted'>{{ item.createdAt | date:'mediumDate':'UTC' }}</small>
            </div>
          </div>
        </div>
      </div>
      <app-paginator [route]='crud.route' (paginate)='crud.route = $event; read()'></app-paginator>
    </div>
`
})
export class UserComponent implements OnInit {

  items: User[] = [];
  readonly user_role = USER_ROLE;

  constructor(
    public router: Router,
    public auth: AuthService,
    public crud: CrudService
  ) {
    this.crud.route.path = 'user';
  }

  ngOnInit(): void {
    this.read();
  }

  read(): void {
    this.crud.read().pipe(first()).subscribe(item => this.items = item.data);
  }

  delete(id: number) {
    this.crud.delete(id).subscribe(() => this.items = this.items.filter(item => item.id != id));
  }

  search(query?: string): void {
    if (query) { this.crud.route.search = query; this.items = []; }
    this.crud.read().pipe(first()).subscribe(item => this.items = this.items.concat(item.data));
  }

}
