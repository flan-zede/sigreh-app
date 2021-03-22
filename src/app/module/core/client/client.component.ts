import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { AuthService, CrudService } from 'src/app/service';
import { Client } from 'src/app/model';
import { PageResponseInterface } from 'src/app/interface';
import { Feature } from 'src/app/enum';

@Component({
  selector: 'app-client',
  template: `
    <app-search-bar (return)='read()' (query)='search($event)'></app-search-bar>

    <div *ngIf='crud.load' class='d-flex justify-content-center'><mat-progress-spinner mode='indeterminate' [diameter]='20'></mat-progress-spinner></div>

    <div *ngIf='!crud.load && items.length == 0' class='d-flex justify-content-center align-items-center'>{{ 'no_data'|translate }}</div>

    <div class='d-flex justify-content-end position-fixed fixed-bottom mr-4 mb-2'>
      <div class='d-flex flex-column'>
        <button *ngIf='auth.permission.create' (click)='router.navigate([crud.route.path + "/create"])' mat-mini-fab color='primary' class='mb-1'><mat-icon>add</mat-icon></button>
        <button *ngIf='auth.permission.update && crud.route.id' (click)='router.navigate([crud.route.path + "/update/" + crud.route.id])' mat-mini-fab color='primary' class='mb-1'><mat-icon>edit</mat-icon></button>
        <button *ngIf='auth.permission.delete && crud.route.id' (click)='router.navigate([crud.route.path + "/update/" + crud.route.id])' mat-mini-fab color='warn' class='mb-1'><mat-icon>delete_outline</mat-icon></button>
      </div>
    </div>

    <div *ngIf='items.length > 0'>
      <div class='row'>
        <div class='col-lg-12' *ngFor='let item of items; trackBy: crud.trackFn'>
          <div class='d-flex mat-card mb-2 p-2'>
            <div class='flex-grow-1' (click)='router.navigate([crud.route.path + "/read", item.id])'>
              <div class='font-weight-bold'>{{ item.firstname }} {{ item.name }}</div>
              <div>
                <mat-icon inline='true'>date_range</mat-icon> {{ item.enterDate| date:'mediumDate':'UTC' }} {{ item.enterTime }}
                <mat-icon inline='true'>phone</mat-icon> {{ item.phone }}
              </div>
              <mat-chip-list>
                <mat-chip>{{ item.establishment?.city?.department?.region?.name }}</mat-chip>
                <mat-chip>{{ item.establishment?.city?.department?.name }}</mat-chip>
                <mat-chip>{{ item.establishment?.city?.name }}</mat-chip>
                <mat-chip>{{ item.establishment?.name }}</mat-chip>
              </mat-chip-list>
            </div>
            <div class='d-flex flex-column'>
              <mat-icon [matMenuTriggerFor]='optionMenu'>more_horiz</mat-icon>
              <mat-menu #optionMenu='matMenu'>
                <span mat-menu-item (click)='router.navigate([crud.route.path + "/update", item.id])'><mat-icon  inline='true'>edit</mat-icon>{{ 'edit'|translate}}</span>
                <span mat-menu-item (click)='delete(item.id)'><mat-icon  inline='true'>delete</mat-icon>{{ 'delete'|translate}}</span>
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
export class ClientComponent implements OnInit {

  items: Client[] = [];

  constructor(
    public router: Router,
    public auth: AuthService,
    public crud: CrudService
  ) {
    this.crud.route.path = Feature.Client;
    this.crud.route.id = null;
  }

  ngOnInit(): void {
    this.read();
    this.auth.permissions(Feature.Client);
  }

  read(): void {
    this.crud.route.search = null;
    this.crud.read().pipe(first()).subscribe((item: PageResponseInterface) => this.items = item.data);
  }

  delete(id: number): void {
    this.crud.delete(id).subscribe(() => this.items = this.items.filter(item => item.id !== id));
  }

  search(query?: string): void {
    if (query) { this.crud.route.search = query; this.items = []; }
    this.crud.read().pipe(first()).subscribe((item: PageResponseInterface) => this.items = this.items.concat(item.data));
  }

}