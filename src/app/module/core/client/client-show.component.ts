import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { AuthService, CrudService } from 'src/app/service';
import { Client } from 'src/app/model';
import { IDNUMBER_NATURE, BEDROOM_TYPE, OCCUPATION_TYPE, GENDER, NATIONALITY, PHONE_TYPE } from 'src/app/constant';
import { Feature } from 'src/app/enum';

@Component({
  selector: 'app-client-show',
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

    <mat-chip-list>
      <mat-chip>{{ item.establishment?.city?.department?.region?.name }}</mat-chip>
      <mat-chip>{{ item.establishment?.city?.department?.name }}</mat-chip>
      <mat-chip>{{ item.establishment?.city?.name }}</mat-chip>
      <mat-chip>{{ item.establishment?.name }}</mat-chip>
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
        <div class='mb-1'> <b>{{ 'idnumberNature'|translate }}</b> <div *ngFor='let p of idnumberNature'><span *ngIf='p.id == item.idnumberNature'>{{ p.name }}</span></div></div>
        <div class='mb-1'> <b>{{ 'phone'|translate }}</b> <div *ngFor='let p of phoneType'><span *ngIf='p.id == item.phoneType'>{{ p.name }} . {{ item.phone }}</span></div></div>
      </div>
    </div>

    <h3 class='border-bottom mt-2'>{{ 'client_information'|translate }}</h3>
    <div class='row'>
      <div class='col-sm-6'>
        <div class='mb-1'><b>{{ 'enter_date'|translate }}</b> <br> {{ item.enterDate | date:'mediumDate':'UTC' }}</div>
        <div class='mb-1'><b>{{ 'enter_time'|translate }}</b> <br> {{ item.enterTime }}</div>
        <div class='mb-1'><b>{{ 'occupationType'|translate }}</b> <div *ngFor='let p of occupationType'><span *ngIf='p.id == item.occupationType'>{{ p.name }}</span></div></div>
        <div class='mb-1' *ngIf='item.occupationType=="NU"'><b>{{ 'number_of_nights'|translate }}</b> <br> {{ item.numberOfNights }}</div>
        <div class='mb-1' *ngIf='item.occupationType=="PA"'><b>{{ 'number_of_hours'|translate }}</b> <br> {{ item.numberOfHours }}</div>
      </div>
      <div class='col-sm-6'>
        <div class='mb-1'><b>{{ 'bedroomType'|translate }}</b> <div *ngFor='let p of bedroomType'><span *ngIf='p.id == item.bedroomType'>{{ p.name }}</span></div></div>
        <div class='mb-1'><b>{{ 'bedroom_number'|translate }}</b> <br> {{ item.bedroomNumber }}</div>
        <div class='mb-1'> <b>{{ 'created_at'|translate }}</b> <br> {{ item.createdAt | date:'mediumDate':'UTC' }} </div>
        <div class='mb-1'> <b>{{ 'updated_at'|translate }}</b> <br> {{ item.updatedAt | date:'mediumDate':'UTC' }} </div>
      </div>
    </div>

    <h3 class='border-bottom mt-2'>{{ 'partner'|translate }}</h3>
    <table mat-table [dataSource]='item.partners' class='mat-elevation-z8 w-100 mt-2'>
      <ng-container matColumnDef='gender'>
        <th mat-header-cell *matHeaderCellDef>{{ 'gender'|translate }}</th>
        <td mat-cell *matCellDef='let p'> <span *ngFor='let e of gender'><span *ngIf='e.id == p.gender'>{{ p.name }}</span></span> </td>
      </ng-container>
      <ng-container matColumnDef='name'>
        <th mat-header-cell *matHeaderCellDef>{{ 'name'|translate }}</th>
        <td mat-cell *matCellDef='let p'> {{ p.name }} </td>
      </ng-container>
      <ng-container matColumnDef='age'>
        <th mat-header-cell *matHeaderCellDef>{{ 'age'|translate }}</th>
        <td mat-cell *matCellDef='let p'> {{ p.age }} </td>
      </ng-container>
      <tr mat-header-row *matHeaderRowDef='partnerColumns'></tr>
      <tr mat-row *matRowDef='let row; columns: partnerColumns;'></tr>
    </table>

    <br>
  `
})
export class ClientShowComponent implements OnInit {

  item = new Client();

  readonly idnumberNature = IDNUMBER_NATURE;
  readonly bedroomType = BEDROOM_TYPE;
  readonly occupationType = OCCUPATION_TYPE;
  readonly gender = GENDER;
  readonly nationality = NATIONALITY;
  readonly phoneType = PHONE_TYPE;
  partnerColumns: string[] = ['gender', 'name', 'age'];

  constructor(
    private activatedRoute: ActivatedRoute,
    public router: Router,
    public auth: AuthService,
    public crud: CrudService
  ) {
    this.crud.route.path = Feature.Client;
    this.crud.route.id = this.activatedRoute.snapshot.params?.id;
  }

  ngOnInit(): void {
    this.crud.readOne().pipe(first()).subscribe((item: Client) => this.item = item);
    this.auth.permissions(Feature.Client);
  }

}
