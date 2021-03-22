import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { AuthService, CrudService } from 'src/app/service';
import { City } from 'src/app/model';
import { Feature, Permission } from 'src/app/enum';

@Component({
  selector: 'app-city-show',
  template: `
    <div class='d-flex justify-content-start'>
      <mat-icon (click)='router.navigate([crud.route.path])'>keyboard_backspace</mat-icon>
    </div>

    <div *ngIf='crud.load' class='d-flex justify-content-center'><mat-progress-spinner mode='indeterminate' [diameter]='20'></mat-progress-spinner></div>

    <div class='d-flex justify-content-end position-fixed fixed-bottom mr-4 mb-2'>
      <div class='d-flex flex-column'>
        <button *ngIf='permissions.create' (click)='router.navigate([crud.route.path + "/create"])' mat-mini-fab color='primary' class='mb-1'><mat-icon>add</mat-icon></button>
        <button *ngIf='permissions.update && crud.route.id' (click)='router.navigate([crud.route.path + "/update/" + crud.route.id])' mat-mini-fab color='primary' class='mb-1'><mat-icon>edit</mat-icon></button>
        <button *ngIf='permissions.delete && crud.route.id' (click)='crud.delete().subscribe()' mat-mini-fab color='warn' class='mb-1'><mat-icon>delete_outline</mat-icon></button>
      </div>
    </div>

    <br>
    <mat-chip-list>
      <mat-chip>{{ item?.department?.region?.name }}</mat-chip>
      <mat-chip>{{ item?.department?.name }}</mat-chip>
    </mat-chip-list>

    <div class='row mb-2'>
      <div class='col-sm-6'>
        <div class='mb-1'><b>{{ 'name'|translate }}</b> <br> {{ item.name }}</div>
      </div>
    </div>
  `
})
export class CityShowComponent implements OnInit {

  item = new City();
  permissions = {
    create: false,
    update: false,
    delete: false
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    public router: Router,
    public auth: AuthService,
    public crud: CrudService
  ) {
    this.crud.route.path = Feature.City;
    this.crud.route.id = this.activatedRoute.snapshot.params?.id;
    this.permissions.create = this.auth.checkPermission(Feature.City, Permission.Create);
    this.permissions.update = this.auth.checkPermission(Feature.City, Permission.Update);
    this.permissions.delete = this.auth.checkPermission(Feature.City, Permission.Delete);
  }

  ngOnInit(): void {
    this.crud.readOne().pipe(first()).subscribe((item: City) => this.item = item);
  }

}
