import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { AuthService, CrudService } from 'src/app/service';
import { City } from 'src/app/model';

@Component({
  selector: 'app-city',
  template: `
    <app-search-bar (return)='read()' (query)='search($event)'></app-search-bar>
    <app-view-option [ability]='auth.ability()' [count]='items.length' [route]='crud.route' [load]='crud.load'></app-view-option>

    <div *ngIf='items.length > 0'>
      <div class='row'>
        <div class='col-lg-12' *ngFor='let item of items; trackBy: crud.trackFn'>
          <div class='d-flex mat-card mb-2 p-2'>
            <div class='flex-grow-1' (click)='router.navigate([crud.route.path + "/show", item.id])'>
              <div><b>{{ item.name }}</b></div>
              {{ 'department'|translate}} . {{ item.department?.name }}
            </div>
            <div>
              <button mat-button [matMenuTriggerFor]='optionMenu'><mat-icon>more_horiz</mat-icon></button>
              <mat-menu #optionMenu='matMenu'>
                <span mat-menu-item (click)='router.navigate([crud.route.path + "/edit", item.id])'><mat-icon>edit</mat-icon>{{ 'edit'|translate}}</span>
                <span mat-menu-item (click)='delete(item.id)'><mat-icon>delete</mat-icon>{{ 'delete'|translate}}</span>
              </mat-menu>
            </div>
          </div>
        </div>
      </div>
      <app-paginator [route]='crud.route' (paginate)='crud.route = $event; read()'></app-paginator>
    </div>
`
})
export class CityComponent implements OnInit {

  items: City[] = [];

  constructor(
    public router: Router,
    public auth: AuthService,
    public crud: CrudService
  ) {
    this.crud.route.path = 'city';
  }

  ngOnInit(): void {
    this.read();
  }

  read(): void {
    this.crud.read().pipe(first()).subscribe(item => this.items = item.data);
  }

  delete(id: number) {
    this.crud.delete(id).subscribe(() => this.items = this.items.filter(item => item.id != id));
  }

  search(query?: string): void {
    if (query) { this.crud.route.search = query; this.items = []; }
    this.crud.read().pipe(first()).subscribe(item => this.items = this.items.concat(item.data));
  }

}
