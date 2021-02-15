import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

import { ApiService } from 'src/app/service/api.service';
import { AlertService } from 'src/app/service/alert.service';

import { AlertConfirmComponent } from 'src/app/shared/component/alert-confirm.component';

import { City } from 'src/app/model/city.model';

import { ROUTE } from 'src/app/shared/constant/route.constant';

@Component({
  selector: 'app-city',
  template: `
    <div class='d-flex justify-content-end position-fixed fixed-bottom mr-4'>
      <button (click)='router.navigate([route.path, "new"])' mat-mini-fab color='primary' class='mb-1'><mat-icon>add</mat-icon></button>
    </div>

    <app-search-bar (return)='find()' (query)='search($event)'></app-search-bar>

    <div class='d-flex justify-content-center mr-4 mb-2'>
      <mat-progress-spinner *ngIf='loader' mode='indeterminate' [diameter]='20'></mat-progress-spinner>
    </div>

    <div class='d-flex justify-content-center align-items-center'>
      <div *ngIf='!loader && items?.length == 0'>{{ 'no_data'|translate }}</div>
    </div>

    <div class='row' *ngIf='items?.length > 0'>
      <div class='col-lg-12 mb-2' *ngFor='let item of items; trackBy: trackFn'>
        <mat-card>
          <mat-card-content>
            <div class='d-flex'>
              <div class='flex-grow-1' (click)='router.navigate([route.path + "/show", item.id])'>
                <span>{{ item.name }}</span>
              </div>
              <button mat-flat-button (click)='router.navigate([route.path + "/edit", item.id])'><mat-icon>edit</mat-icon></button>
              <button mat-flat-button (click)='delete(item.id)'><mat-icon>delete</mat-icon></button>
            </div>
            <div class='d-flex'>
              <div class='flex-grow-1'>
                <div (click)='router.navigate([route.path + "/show", item.id])' >{{ '' }}</div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
      <div class='col-lg-12 mb-2'>
        <mat-paginator
            (page)='handlePageEvent($event)'
            [length]='route.page.length'
            [pageSize]='route.page.size'
            [showFirstLastButtons]='route.page.showFirstLastButtons'
            [pageSizeOptions]='route.page.sizeOptions'
            [pageIndex]='route.page.index'>
        </mat-paginator>
      </div>
    </div>
`
})
export class CityComponent implements OnInit {

  items: City[] = null;
  loader: boolean;
  route = ROUTE;

  constructor(
    public router: Router,
    protected dialog: MatDialog,
    public trans: TranslateService,
    protected api: ApiService,
    public alert: AlertService
  ) {
    this.route.path = 'city';
  }

  ngOnInit(): void {
    this.find();
  }

  find(): void {
    this.loader = true;
    this.api.find(this.route).pipe(first())
      .subscribe(
        res => { this.items = res.data; this.loader = false; },
        err => { this.alert.error(err); this.loader = false; }
      );
  }

  search(query?: string): void {
    this.loader = true;
    if (query) { this.route.search = query; this.items = []; }
    this.api.find(this.route).pipe(first())
      .subscribe(
        res => { this.items = this.items.concat(res.data); this.loader = false; },
        err => { this.alert.error(err); this.loader = false; }
      );
  }

  delete(id: number): void {
    this.dialog.open(AlertConfirmComponent, { data: { message: this.trans.get('confirm.delete') } }).afterClosed()
      .subscribe(
        res => {
          if (res) {
            this.loader = true;
            this.api.delete(this.route, id).pipe(first())
              .subscribe(
                () => { this.items = this.items.filter(item => item.id !== id); this.loader = false; },
                err => { this.alert.error(err); this.loader = false; }
              );
          }
        }
      );
  }

  trackFn = (i: number, item: any) => item.id;

  handlePageEvent(event: PageEvent): void {
    this.route.page.length = event.length;
    this.route.page.size = event.pageSize;
    this.route.page.index = event.pageIndex;
    this.find();
  }
}
