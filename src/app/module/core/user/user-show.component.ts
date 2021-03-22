import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { AuthService, CrudService } from 'src/app/service';
import { User } from 'src/app/model';
import { ROLE, IDNUMBER_NATURE, GENDER, NATIONALITY, PHONE_TYPE } from 'src/app/constant';
import { Feature, Permission } from 'src/app/enum';

@Component({
  selector: 'app-user-show',
  template: `
    <div class='d-flex justify-content-start'>
      <mat-icon (click)='router.navigate([crud.route.path])'>keyboard_backspace</mat-icon>
    </div>

    <div *ngIf='crud.load' class='d-flex justify-content-center'><mat-progress-spinner mode='indeterminate' [diameter]='20'></mat-progress-spinner></div>

    <div class='d-flex justify-content-end position-fixed fixed-bottom mr-4 mb-2'>
      <div class='d-flex flex-column'>
        <button *ngIf='auth.permission.create' (click)='router.navigate([crud.route.path + "/create"])' mat-mini-fab color='primary' class='mb-1'><mat-icon>add</mat-icon></button>
        <button *ngIf='auth.permission.update && crud.route.id' (click)='router.navigate([crud.route.path + "/update/" + crud.route.id])' mat-mini-fab color='primary' class='mb-1'><mat-icon>edit</mat-icon></button>
        <button *ngIf='auth.permission.delete && crud.route.id' (click)='crud.delete().subscribe()' mat-mini-fab color='warn' class='mb-1'><mat-icon>delete_outline</mat-icon></button>
      </div>
    </div>

    <br>

    <h3 class='border-bottom'>{{ 'person_information'|translate }}</h3>
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

    <h3 class='border-bottom'>{{ 'account_information'|translate }} <mat-icon inline='true' *ngIf='!item.active'>lock</mat-icon></h3>
    <div class='row mb-2'>
      <div class='col-sm-6'>
        <div class='mb-1'> <b>{{ 'username'|translate }}</b> <br> {{ item.username }}</div>
        <div class='mb-1'> <b>{{ 'email'|translate }}</b> <br> {{ item.email }} </div>
        <div class='mb-1'> <b>{{ 'role'|translate }}</b> <div *ngFor='let p of role'><span *ngIf='p.id == item.role'>{{ p.name }}</span></div></div>
      </div>
      <div class='col-sm-6'>
        <div class='mb-1'> <b>{{ 'created_at'|translate }}</b> <br> {{ item.createdAt | date:'mediumDate':'UTC' }} </div>
        <div class='mb-1'> <b>{{ 'updated_at'|translate }}</b> <br> {{ item.updatedAt | date:'mediumDate':'UTC' }} </div>
      </div>
    </div>

    <h3 class='border-bottom' *ngIf='["DRMT","DDMT","PP","REH","GEH"].includes(item.role)'>{{ 'relation_information'|translate }}</h3>
    <div class='row'>
      <div class='col-lg-12'>
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
    </div>

    <br>
  `
})
export class UserShowComponent implements OnInit {

  item = new User();
  readonly role = ROLE;
  readonly idnumberNature = IDNUMBER_NATURE;
  readonly gender = GENDER;
  readonly nationality = NATIONALITY;
  readonly phoneType = PHONE_TYPE;

  constructor(
    private activatedRoute: ActivatedRoute,
    public router: Router,
    public auth: AuthService,
    public crud: CrudService
  ) {
    this.crud.route.path = Feature.User;
    this.crud.route.id = this.activatedRoute.snapshot.params?.id;
  }

  ngOnInit(): void {
    this.crud.readOne().pipe(first()).subscribe((item: User) => this.item = item);
    this.auth.permissions(Feature.User);
  }

}
