import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { of } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { AlertService, AuthService } from 'src/app/service';
import { Establishment } from 'src/app/model';
import { Feature } from 'src/app/enum';
import { DIALOG_CONFIG, ESTABLISHMENT_NATURE } from 'src/app/constant';
import { AlertConfirmComponent } from '../../shared/component';
import { PageInterface, PageResponseInterface, RouteInterface } from 'src/app/interface';

@Component({
  selector: 'app-establishment',
  template: `
    <app-search-bar (return)='read()' (query)='search = $event; read(search)'></app-search-bar>

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
              <span class='font-weight-bold'>{{ item.name }}</span> . <span *ngFor='let p of establishmentNature'><span *ngIf='p.id == item.nature'>{{ p.name }}</span></span>
              <div>{{ item.municipality }} </div>
              <mat-chip-list>
                <mat-chip>{{ 'region'|translate}}: {{ item.city?.department?.region?.name }}</mat-chip>
                <mat-chip>{{ 'department'|translate}}: {{ item.city?.department?.name }}</mat-chip>
                <mat-chip>{{ 'city'|translate}}: {{ item.city?.name }}</mat-chip>
              </mat-chip-list>
            </div>
            <div>
              <mat-icon [matMenuTriggerFor]='optionMenu'>more_horiz</mat-icon>
              <mat-menu #optionMenu='matMenu'>
                <span mat-menu-item (click)='router.navigate([route.path + "/update", item.id])'><mat-icon inline='true'>edit</mat-icon>{{ 'edit'|translate}}</span>
                <span mat-menu-item (click)='delete(item.id)'><mat-icon inline='true'>delete</mat-icon>{{ 'delete'|translate}}</span>
              </mat-menu>
            </div>
          </div>
        </div>
      </div>
      <app-paginator [page]='page' (paginate)='page = $event; read(search)'></app-paginator>
    </div>
`
})
export class EstablishmentComponent implements OnInit {

  load = false;
  route: RouteInterface;
  page: PageInterface;
  search = '';
  readonly dialogConfig = DIALOG_CONFIG;

  items: Establishment[] = [];
  readonly establishmentNature = ESTABLISHMENT_NATURE;

  constructor(
    public router: Router,
    protected dialog: MatDialog,
    private http: HttpClient,
    private trans: TranslateService,
    private alert: AlertService,
    public auth: AuthService
  ) {
    this.route = { path: Feature.Establishment, id: null };
    this.page = { index: 1, size: 10, length: 0, sizeOptions: [], showFirstLastButtons: true };
  }

  ngOnInit(): void {
    this.read();
    this.auth.permissions(Feature.Establishment);
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
