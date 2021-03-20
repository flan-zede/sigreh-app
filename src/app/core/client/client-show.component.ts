import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { AuthService, CrudService } from 'src/app/service';
import { Client } from 'src/app/model';
import { IDNUMBER_NATURE, BEDROOM_TYPE, OCCUPATION_TYPE, GENDER, NATIONALITY, PHONE_TYPE } from 'src/app/shared/constant';

@Component({
  selector: 'app-client-show',
  template: `
    <app-view-option [ability]='auth.ability()' [count]='-1' [route]='crud.route' [load]='crud.load' (delete)='crud.delete().subscribe()'></app-view-option>

    <mat-chip-list>
      <mat-chip>{{ item.establishment.city.name }}</mat-chip>
      <mat-chip>{{ item.establishment.name }}</mat-chip>
    </mat-chip-list>

    <h3 class='border-bottom mt-2'>{{ 'person_information'|translate }}</h3>
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
    
    <h3 class='border-bottom mt-2'>{{ 'client_information'|translate }}</h3>
    <div class='row'>
      <div class='col-sm-6'>
        <div class='mb-1'><b>{{ 'enter_date'|translate }}</b> <br> {{ item.enterDate | date:'mediumDate':'UTC' }}</div>
        <div class='mb-1'><b>{{ 'enter_time'|translate }}</b> <br> {{ item.enterTime }}</div>
        <div class='mb-1'><b>{{ 'occupation_type'|translate }}</b> <div *ngFor='let p of occupation_type'><span *ngIf='p.id == item.occupationType'>{{ p.name }}</span></div></div>
        <div class='mb-1' *ngIf='item.occupationType=="NU"'><b>{{ 'number_of_nights'|translate }}</b> <br> {{ item.numberOfNights }}</div>
        <div class='mb-1' *ngIf='item.occupationType=="PA"'><b>{{ 'number_of_hours'|translate }}</b> <br> {{ item.numberOfHours }}</div>
      </div>
      <div class='col-sm-6'>
        <div class='mb-1'><b>{{ 'bedroom_type'|translate }}</b> <div *ngFor='let p of bedroom_type'><span *ngIf='p.id == item.bedroomType'>{{ p.name }}</span></div></div>
        <div class='mb-1'><b>{{ 'bedroom_number'|translate }}</b> <br> {{ item.bedroomNumber }}</div>
        <div class='mb-1'> <b>{{ 'created_at'|translate }}</b> <br> {{ item.createdAt | date:'mediumDate':'UTC' }} </div>
        <div class='mb-1'> <b>{{ 'updated_at'|translate }}</b> <br> {{ item.updatedAt | date:'mediumDate':'UTC' }} </div>
      </div>
    </div>

    <h3 class='border-bottom mt-2'>{{ 'partner'|translate }}</h3>
    <div class='row'>
      <div class='col-sm-12'>
        <div class='inline-block' *ngFor='let el of item.partners'>
          <div *ngFor='let p of gender'><span *ngIf='p.id == item.gender'>{{ p.name }}</span></div> 
          {{ 'name'|translate }} :{{ el.name }} - {{ 'age'|translate }} : {{ el.age }}
        </div>
      </div>
    </div>

    <br>
  `
})
export class ClientShowComponent implements OnInit {

  item = new Client();

  readonly idnumber_nature = IDNUMBER_NATURE;
  readonly bedroom_type = BEDROOM_TYPE;
  readonly occupation_type = OCCUPATION_TYPE;
  readonly gender = GENDER;
  readonly nationality = NATIONALITY;
  readonly phone_type = PHONE_TYPE;

  constructor(
    private activatedRoute: ActivatedRoute,
    public router: Router,
    public auth: AuthService,
    public crud: CrudService
  ) {
    this.crud.route.path = 'client';
    this.crud.route.id = this.activatedRoute.snapshot.params?.id;
  }

  ngOnInit(): void {
    this.crud.readOne().pipe(first()).subscribe((item: Client) => this.item = item);
  }

}
