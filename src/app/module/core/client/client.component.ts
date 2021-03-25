import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { AlertService, AuthService } from 'src/app/service';
import { City, Department, Establishment, Region } from 'src/app/model';
import { Feature } from 'src/app/enum';
import { DIALOG_CONFIG } from 'src/app/constant';
import { AlertConfirmComponent } from '../../shared/component';
import { PageInterface, PageResponseInterface, RouteInterface } from 'src/app/interface';

@Component({
  selector: 'app-client',
  template: `
    <app-search-bar (return)='read()' (query)='search = $event; read(search)'></app-search-bar>

    <div class='row'>
      <div class='col-md-5'>
        <mat-form-field appearance='outline'>
          <mat-label>{{ 'region'|translate }}</mat-label>
          <mat-select>
            <mat-option *ngFor='let p of regions' [value]='p.id'>{{ p.name }}</mat-option>
          </mat-select>
        </mat-form-field>
      </div>
      <div class='col-md-5'>
        <mat-form-field appearance='outline'>
          <mat-label>{{ 'department'|translate }}</mat-label>
          <mat-select>
            <mat-option *ngFor='let p of departments' [value]='p.id'>{{ p.name }}</mat-option>
          </mat-select>
        </mat-form-field>
      </div>
      <div class='col-md-2'></div>
    </div>

    <div class='row'>
      <div class='col-md-5'>
        <mat-form-field appearance='outline'>
          <mat-label>{{ 'city'|translate }}</mat-label>
          <mat-select>
            <mat-option *ngFor='let p of cities' [value]='p.id'>{{ p.name }}</mat-option>
          </mat-select>
        </mat-form-field>
      </div>
      <div class='col-md-5'>
        <mat-form-field>
          <mat-label>{{ 'establishment'|translate }}</mat-label>
          <mat-select>
            <mat-option *ngFor='let p of establishments' [value]='p.id'>{{ p.name }}</mat-option>
          </mat-select>
        </mat-form-field>
      </div>
      <div class='col-md-2'>
        <button (click)='read()' mat-stroked-button><mat-icon>filter_alt</mat-icon></button>
      </div>
    </div>

    <div *ngIf='load' class='d-flex justify-content-center'><mat-progress-spinner mode='indeterminate' [diameter]='20'></mat-progress-spinner></div>

    <div *ngIf='!load && items.length == 0' class='d-flex justify-content-center'>{{ 'no_data'|translate }}</div>

    <div *ngIf='auth.permission.create' class='d-flex justify-content-end position-fixed fixed-bottom mr-3 mb-3'>
      <button (click)='router.navigate([route.path + "/create"])' mat-fab color='primary' class=''><mat-icon>add</mat-icon></button>
    </div>

    <div *ngIf='items.length > 0'>
      <div class='row'>
        <div class='col-lg-12' *ngFor='let item of items; trackBy: trackFn'>
          <div class='d-flex mat-card mb-2 p-2'>
            <div class='flex-grow-1' (click)='router.navigate([route.path + "/read", item.id])'>
              <div class='font-weight-bold'>{{ item.firstname }} {{ item.name }}</div>
              <div>
                <mat-icon inline='true'>date_range</mat-icon> {{ item.enterDate| date:'mediumDate':'UTC' }} {{ item.enterTime }}
                <mat-icon inline='true'>phone</mat-icon> {{ item.phone }}
              </div>
              <div>
                {{ item.establishment?.city?.department?.region?.name }}
                > {{ item.establishment?.city?.department?.name }}
                > {{ item.establishment?.city?.name }}
                > {{ item.establishment?.name }}
              </div>
            </div>
            <div class='d-flex flex-column'>
              <mat-icon [matMenuTriggerFor]='optionMenu'>more_horiz</mat-icon>
              <mat-menu #optionMenu='matMenu'>
                <span mat-menu-item (click)='router.navigate([route.path + "/read", item.id])'><mat-icon  inline='true'>eye</mat-icon>{{ 'read'|translate}}</span>
                <span mat-menu-item (click)='router.navigate([route.path + "/update", item.id])'><mat-icon  inline='true'>edit</mat-icon>{{ 'edit'|translate}}</span>
                <span mat-menu-item (click)='delete(item.id)'><mat-icon  inline='true'>delete</mat-icon>{{ 'delete'|translate}}</span>
              </mat-menu>
              <small class='text-muted'>{{ item.createdAt | date:'mediumDate':'UTC' }}</small>
            </div>
          </div>
        </div>
      </div>
      <app-paginator [page]='page' (paginate)='page = $event; read(search)'></app-paginator>
    </div>
`
})
export class ClientComponent implements OnInit {

  load = false;
  route: RouteInterface;
  page: PageInterface;
  search = '';
  readonly dialogConfig = DIALOG_CONFIG;

  items: City[] = [];

  regions: Region[] = [];
  departments: Department[] = [];
  establishments: Establishment[] = [];
  cities: City[] = [];

  constructor(
    public router: Router,
    protected dialog: MatDialog,
    private http: HttpClient,
    private trans: TranslateService,
    private alert: AlertService,
    public auth: AuthService
  ) {
    this.route = { path: Feature.Client, id: null };
    this.page = { index: 1, size: 10, length: 0, sizeOptions: [], showFirstLastButtons: true };
  }

  ngOnInit(): void {
    forkJoin({
      regions: this.http.get(`${environment.api}/region?sort=asc`),
      departments: this.http.get(`${environment.api}/department?sort=asc`),
      establishments: this.http.get(`${environment.api}/establishment?sort=asc`),
      cities: this.http.get(`${environment.api}/city?sort=asc`)
    }).pipe(first())
      .subscribe((res: any) => {
        this.regions = res.regions;
        this.departments = res.departments;
        this.establishments = res.establishments;
        this.cities = res.cities;
      });
    this.read();
    this.auth.permissions(Feature.City);
  }

  read(search = ''): void {
    this.items = [];
    this.http.get(`${environment.api}/${this.route.path}?sort=desc&index=${this.page.index}&size=${this.page.size}&search=${search}`)
      .pipe(
        first(),
        tap(() => this.load = true),
        finalize(() => this.load = false),
        catchError((err: HttpErrorResponse) => { this.alert.error(err); return of(); })
      )
      .subscribe((item: PageResponseInterface) => this.items = item.data);
  }

  delete(id: number): void {
    this.trans.stream('alertMessage.delete')
      .subscribe(text =>
        this.dialog.open(AlertConfirmComponent, { data: { text } }).afterClosed()
          .subscribe(res => {
            if (res) {
              this.http.delete(`${environment.api}/${this.route.path}/${id}`)
                .pipe(
                  first(),
                  catchError((err: HttpErrorResponse) => { this.alert.error(err); return of(); })
                )
                .subscribe(() => this.items = this.items.filter(item => item.id !== id));
            }
          }
          )
      );
  }

  trackFn = (i: number, res: any) => res.id;

}
