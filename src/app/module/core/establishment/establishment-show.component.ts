import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { AuthService, CrudService } from 'src/app/service';
import { Establishment } from 'src/app/model/establishment.class';
import { ESTABLISHMENT_NATURE } from 'src/app/constant';
import { Feature, Permission } from 'src/app/enum';

@Component({
  selector: 'app-establishment-show',
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
      <mat-chip>{{ item.city?.department?.region?.name }}</mat-chip>
      <mat-chip>{{ item.city?.department?.name }}</mat-chip>
      <mat-chip>{{ item.city?.name }}</mat-chip>
    </mat-chip-list>

    <div class='row mb-2'>
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

  item = new Establishment();
  readonly establishmentNature = ESTABLISHMENT_NATURE;

  constructor(
    private activatedRoute: ActivatedRoute,
    public router: Router,
    public auth: AuthService,
    public crud: CrudService
  ) {
    this.crud.route.path = Feature.Establishment;
    this.crud.route.id = this.activatedRoute.snapshot.params?.id;
  }

  ngOnInit(): void {
    this.crud.readOne().pipe(first()).subscribe((item: Establishment) => this.item = item);
    this.auth.permissions(Feature.Establishment);
  }

}
