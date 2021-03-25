import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { of } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { AlertService, AuthService } from 'src/app/service';
import { Client } from 'src/app/model';
import { Feature } from 'src/app/enum';
import { BEDROOM_TYPE, DIALOG_CONFIG, GENDER, IDNUMBER_NATURE, NATIONALITY, OCCUPATION_TYPE, PHONE_TYPE } from 'src/app/constant';
import { AlertConfirmComponent } from '../../shared/component';
import { RouteInterface } from 'src/app/interface';

@Component({
  selector: 'app-client-show',
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
      <mat-chip>{{ 'region'|translate }}: {{ item.establishment?.city?.department?.region?.name }}</mat-chip>
      <mat-chip>{{ 'department'|translate }}: {{ item.establishment?.city?.department?.name }}</mat-chip>
      <mat-chip>{{ 'city'|translate }}: {{ item.establishment?.city?.name }}</mat-chip>
      <mat-chip>{{ 'establishment'|translate }}: {{ item.establishment?.name }}</mat-chip>
    </mat-chip-list>

    <h3 class='border-bottom mt-2'>{{ 'personInformation'|translate }}</h3>
    <div class='row mb-2'>
      <div class='col-sm-6'>
        <div class='mb-1'> <b>{{ 'firstname'|translate }}</b> <br> {{ item.firstname }} </div>
        <div class='mb-1'> <b>{{ 'name'|translate }}</b> <br> {{ item.name }} </div>
        <div class='mb-1'> <b>{{ 'birthdate'|translate }}</b> <br> {{ item.birthdate | date:'mediumDate':'UTC' }} </div>
        <div class='mb-1'> <b>{{ 'gender'|translate }}</b> <div *ngFor='let p of gender'><span *ngIf='p.id == item.gender'>{{ p.name }}</span></div></div>
      </div>
      <div class='col-sm-6'>
        <div class='mb-1'> <b>{{ 'nationality'|translate }}</b> <div *ngFor='let p of nationality'><span *ngIf='p.id == item.nationality'>{{ p.name }}</span></div></div>
        <div class='mb-1'> <b>{{ 'idnumber'|translate }}</b> <br> {{ item.idnumber }} </div>
        <div class='mb-1'> <b>{{ 'idnumberNature'|translate }}</b> <div *ngFor='let p of idnumberNature'><span *ngIf='p.id == item.idnumberNature'>{{ p.name }}</span></div></div>
        <div class='mb-1'> <b>{{ 'phone'|translate }}</b> <div *ngFor='let p of phoneType'><span *ngIf='p.id == item.phoneType'>{{ p.name }} . {{ item.phone }}</span></div></div>
      </div>
    </div>

    <h3 class='border-bottom mt-2'>{{ 'clientInformation'|translate }}</h3>
    <div class='row'>
      <div class='col-sm-6'>
        <div class='mb-1'><b>{{ 'enterDate'|translate }}</b> <br> {{ item.enterDate | date:'mediumDate':'UTC' }}</div>
        <div class='mb-1'><b>{{ 'enterTime'|translate }}</b> <br> {{ item.enterTime }}</div>
        <div class='mb-1'><b>{{ 'occupationType'|translate }}</b> <div *ngFor='let p of occupationType'><span *ngIf='p.id == item.occupationType'>{{ p.name }}</span></div></div>
        <div class='mb-1' *ngIf='item.occupationType=="NU"'><b>{{ 'numberOfNights'|translate }}</b> <br> {{ item.numberOfNights }}</div>
        <div class='mb-1' *ngIf='item.occupationType=="PA"'><b>{{ 'numberOfHours'|translate }}</b> <br> {{ item.numberOfHours }}</div>
      </div>
      <div class='col-sm-6'>
        <div class='mb-1'><b>{{ 'bedroomType'|translate }}</b> <div *ngFor='let p of bedroomType'><span *ngIf='p.id == item.bedroomType'>{{ p.name }}</span></div></div>
        <div class='mb-1'><b>{{ 'bedroomNumber'|translate }}</b> <br> {{ item.bedroomNumber }}</div>
        <div class='mb-1'> <b>{{ 'createdAt'|translate }}</b> <br> {{ item.createdAt | date:'mediumDate':'UTC' }} </div>
        <div class='mb-1'> <b>{{ 'updatedAt'|translate }}</b> <br> {{ item.updatedAt | date:'mediumDate':'UTC' }} </div>
      </div>
    </div>

    <h3 class='border-bottom mt-2'>{{ 'partner'|translate }}</h3>
    <table class='w-100 mt-2 mb-3'>
      <thead>
        <tr>
          <th></th>
          <th>{{ 'gender'|translate }}</th>
          <th>{{ 'name'|translate }}</th>
          <th>{{ 'age'|translate }}</th>
          <th> </th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor='let p of item.partners; let index = index;'>
          <td>{{ index }}</td>
          <td><span *ngFor='let e of gender'><span *ngIf='e.id == p.gender'>{{ p.name }}</span></span></td>
          <td>{{ p.name }}</td>
          <td>{{ p.age }}</td>
          <td><button mat-stroked-button><mat-icon>close</mat-icon></button></td>
        </tr>
      </tbody>

    <br>
  `
})
export class ClientShowComponent implements OnInit {

  load = false;
  route: RouteInterface;
  readonly dialogConfig = DIALOG_CONFIG;

  item = new Client();

  readonly idnumberNature = IDNUMBER_NATURE;
  readonly bedroomType = BEDROOM_TYPE;
  readonly occupationType = OCCUPATION_TYPE;
  readonly gender = GENDER;
  readonly nationality = NATIONALITY;
  readonly phoneType = PHONE_TYPE;

  constructor(
    private activatedRoute: ActivatedRoute,
    public router: Router,
    protected dialog: MatDialog,
    private http: HttpClient,
    private trans: TranslateService,
    private alert: AlertService,
    public auth: AuthService
  ) {
    this.route = { path: Feature.Client, id: this.activatedRoute.snapshot.params?.id };
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
        .subscribe((item: Client) => this.item = item);
    }
    this.auth.permissions(Feature.Client);
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
