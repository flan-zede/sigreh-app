import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { of } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { AlertService, AuthService } from 'src/app/service';
import { User } from 'src/app/model';
import { Feature } from 'src/app/enum';
import { DIALOG_CONFIG, GENDER, IDNUMBER_NATURE, NATIONALITY, PHONE_TYPE, ROLE } from 'src/app/constant';
import { AlertConfirmComponent } from '../../shared/component';
import { RouteInterface } from 'src/app/interface';

@Component({
  selector: 'app-user-show',
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

    <h3 class='border-bottom'>{{ 'personInformation'|translate }}</h3>
    <div class='row mb-2'>
      <div class='col-sm-6'>
        <div class='m-1 font-weight-bold'> <b>{{ 'firstname'|translate }}</b> <br> {{ item.firstname }} </div>
        <div class='m-1 font-weight-bold'> <b>{{ 'name'|translate }}</b> <br> {{ item.name }} </div>
        <div class='m-1 font-weight-bold'> <b>{{ 'birthdate'|translate }}</b> <br> {{ item.birthdate | date:'mediumDate':'UTC' }} </div>
        <div class='m-1 font-weight-bold'> <b>{{ 'gender'|translate }}</b> <div *ngFor='let p of gender'><span *ngIf='p.id == item.gender'>{{ p.name }}</span></div></div>
      </div>
      <div class='col-sm-6'>
        <div class='m-1 font-weight-bold'> <b>{{ 'nationality'|translate }}</b> <div *ngFor='let p of nationality'><span *ngIf='p.id == item.nationality'>{{ p.name }}</span></div></div>
        <div class='m-1 font-weight-bold'> <b>{{ 'idnumber'|translate }}</b> <br> {{ item.idnumber }} </div>
        <div class='m-1 font-weight-bold'> <b>{{ 'idnumberNature'|translate }}</b> <div *ngFor='let p of idnumberNature'><span *ngIf='p.id == item.idnumberNature'>{{ p.name }}</span></div></div>
        <div class='m-1 font-weight-bold'> <b>{{ 'phone'|translate }}</b> <div *ngFor='let p of phoneType'><span *ngIf='p.id == item.phoneType'>{{ p.name }} . {{ item.phone }}</span></div></div>
      </div>
    </div>

    <h3 class='border-bottom'>{{ 'accountInformation'|translate }} <mat-icon inline='true' *ngIf='!item.active'>lock</mat-icon></h3>
    <div class='row mb-2'>
      <div class='col-sm-6'>
        <div class='m-1 font-weight-bold'> <b>{{ 'username'|translate }}</b> <br> {{ item.username }}</div>
        <div class='m-1 font-weight-bold'> <b>{{ 'email'|translate }}</b> <br> {{ item.email }} </div>
        <div class='m-1 font-weight-bold'> <b>{{ 'role'|translate }}</b> <span *ngFor='let p of role'><span *ngIf='p.id == item.role'>{{ p.name }}</span></span></div>
      </div>
      <div class='col-sm-6'>
        <div class='m-1 font-weight-bold'> <b>{{ 'createdAt'|translate }}</b> <br> {{ item.createdAt | date:'mediumDate':'UTC' }} </div>
        <div class='m-1 font-weight-bold'> <b>{{ 'updatedAt'|translate }}</b> <br> {{ item.updatedAt | date:'mediumDate':'UTC' }} </div>
      </div>
    </div>

    <h3 class='border-bottom'>{{ 'relation_information'|translate }}</h3>
    <div class='row'>
      <div class='col-lg-12'>
        <div *ngIf='["DRMT"].includes(item.role)'>
          <mat-chip-list>
            <mat-chip *ngFor='let p of item.regions'>{{ 'region'|translate }}: {{ p.name }}</mat-chip>
          </mat-chip-list>
        </div>
        <div *ngIf='["DDMT","PP"].includes(item.role)'>
          <mat-chip-list>
            <mat-chip *ngFor='let p of item.departments'>{{ 'department'|translate }}: {{ p.name }}</mat-chip>
          </mat-chip-list>
        </div>
        <div *ngIf='["REH","GEH"].includes(item.role)'>
          <mat-chip-list>
            <mat-chip *ngFor='let p of item.establishments'>{{ 'establishment'|translate }}: {{ p.name }}</mat-chip>
          </mat-chip-list>
        </div>
      </div>
    </div>

    <br>
  `
})
export class UserShowComponent implements OnInit {

  load = false;
  route: RouteInterface;
  readonly dialogConfig = DIALOG_CONFIG;

  item = new User();
  readonly role = ROLE;
  readonly idnumberNature = IDNUMBER_NATURE;
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
    this.route = { path: Feature.User, id: this.activatedRoute.snapshot.params?.id };
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
        .subscribe((item: User) => this.item = item);
    }
    this.auth.permissions(Feature.User);
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
