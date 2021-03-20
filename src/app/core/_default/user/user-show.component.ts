import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { AuthService, CrudService } from 'src/app/service';
import { User } from 'src/app/model';
import { USER_ROLE, IDNUMBER_NATURE, GENDER, NATIONALITY, PHONE_TYPE } from 'src/app/shared/constant';

@Component({
  selector: 'app-user-show',
  template: `
    <app-view-option [ability]='auth.ability()' [count]='-1' [route]='crud.route' [load]='crud.load' (delete)='crud.delete().subscribe()'></app-view-option>

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
        <div class='mb-1'> <b>{{ 'idnumber_nature'|translate }}</b> <div *ngFor='let p of idnumber_nature'><span *ngIf='p.id == item.idnumberNature'>{{ p.name }}</span></div></div>
        <div class='mb-1'> <b>{{ 'phone'|translate }}</b> <div *ngFor='let p of phone_type'><span *ngIf='p.id == item.phoneType'>{{ p.name }} . {{ item.phone }}</span></div></div>
      </div>
    </div>
    
    <h3 class='border-bottom'>{{ 'account_information'|translate }} <mat-icon inline='true' *ngIf='!item.active'>lock</mat-icon></h3>
    <div class='row mb-2'>
      <div class='col-sm-6'>
        <div class='mb-1'> <b>{{ 'username'|translate }}</b> <br> {{ item.username }}</div>
        <div class='mb-1'> <b>{{ 'email'|translate }}</b> <br> {{ item.email }} </div>
        <div class='mb-1'> <b>{{ 'role'|translate }}</b> <div *ngFor='let p of user_role'><span *ngIf='p.id == item.role'>{{ p.name }}</span></div></div>
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
  readonly user_role = USER_ROLE;
  readonly idnumber_nature = IDNUMBER_NATURE;
  readonly gender = GENDER;
  readonly nationality = NATIONALITY;
  readonly phone_type = PHONE_TYPE;

  constructor(
    private activatedRoute: ActivatedRoute,
    public router: Router,
    public auth: AuthService,
    public crud: CrudService
  ) {
    this.crud.route.path = 'user';
    this.crud.route.id = this.activatedRoute.snapshot.params?.id;
  }

  ngOnInit(): void {
    this.crud.readOne().pipe(first()).subscribe((item: User) => this.item = item);
  }

}
