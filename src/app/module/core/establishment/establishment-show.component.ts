import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
import { RouteInterface } from 'src/app/interface';

@Component({
  selector: 'app-establishment-show',
  template: `
    <div class='d-flex justify-content-start'>
      <mat-icon (click)='router.navigate([route.path])'>keyboard_backspace</mat-icon>
    </div>

    <div *ngIf='load' class='d-flex justify-content-center'>
      <mat-progress-spinner mode='indeterminate' [diameter]='20'></mat-progress-spinner>
    </div>

    <div class='d-flex justify-content-end position-fixed fixed-bottom mr-4 mb-4'>
      <div class='d-flex flex-column'>
        <button *ngIf='auth.permission.create' (click)='router.navigate([route.path + "/create"])' mat-fab color='primary'><mat-icon>add</mat-icon></button>
        <button *ngIf='auth.permission.update && route.id' [disabled]='load' (click)='router.navigate([route.path + "/update/" + route.id])' mat-fab color='primary' class='mt-2 mb-2'><mat-icon>edit</mat-icon></button>
        <button *ngIf='auth.permission.delete && route.id' [disabled]='load' (click)='delete()' mat-fab color='warn'><mat-icon>delete_outline</mat-icon></button>
      </div>
    </div>

    <br>

    <mat-chip-list>
      <mat-chip>{{ 'region'|translate}}: {{ item.city?.department?.region?.name }}</mat-chip>
      <mat-chip>{{ 'department'|translate}}: {{ item.city?.department?.name }}</mat-chip>
      <mat-chip>{{ 'city'|translate}}: {{ item.city?.name }}</mat-chip>
    </mat-chip-list>

    <div class='row mt-2'>
      <div class='col-sm-6'>
        <div class='mb-1'><b>{{ 'name'|translate }}</b> <br> {{ item.name }}</div>
        <div class='mb-1'><b>{{ 'nature'|translate }}</b> <div *ngFor='let p of establishmentNature'><span *ngIf='p.id == item.nature'>{{ p.name }}</span></div></div>
      </div>
      <div class='col-sm-6'>
        <div class='mb-1'><b>{{ 'municipality'|translate }}</b> <br> {{ item.municipality }}</div>
        <div class='mb-1'><b>{{ 'location'|translate }}</b> <br> {{ item.location }}</div>
      </div>
    </div>
  `
})
export class EstablishmentShowComponent implements OnInit {

  load = false;
  route: RouteInterface;
  readonly dialogConfig = DIALOG_CONFIG;

  item = new Establishment();
  readonly establishmentNature = ESTABLISHMENT_NATURE;

  constructor(
    private activatedRoute: ActivatedRoute,
    public router: Router,
    protected dialog: MatDialog,
    private http: HttpClient,
    private trans: TranslateService,
    private alert: AlertService,
    public auth: AuthService
  ) {
    this.route = { path: Feature.Establishment, id: this.activatedRoute.snapshot.params?.id };
  }

  ngOnInit(): void {
    if (this.route.id) {
      this.http.get(`${environment.api}/${this.route.path}/${this.route.id}`)
        .pipe(
          first(),
          tap(() => this.load = true),
          finalize(() => this.load = false),
          catchError((err: HttpErrorResponse) => { this.alert.error(err); return of(); })
        )
        .subscribe((item: Establishment) => this.item = item);
    }
    this.auth.permissions(Feature.Establishment);
  }

  delete(): void {
    this.trans.stream('alertMessage.delete')
      .subscribe(text =>
        this.dialog.open(AlertConfirmComponent, { data: { text } }).afterClosed()
          .subscribe(res => {
            if (res) {
              this.http.delete(`${environment.api}/${this.route.path}/${this.route.id}`)
                .pipe(
                  first(),
                  tap(() => this.load = true),
                  finalize(() => this.load = false),
                  catchError((err: HttpErrorResponse) => { this.alert.error(err); return of(); })
                )
                .subscribe(() => this.router.navigate([this.route.path]));
            }
          })
      );
  }

}
