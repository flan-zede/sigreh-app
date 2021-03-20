import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { AuthService, CrudService } from 'src/app/service';
import { City } from 'src/app/model';

@Component({
  selector: 'app-city-show',
  template: `
    <app-view-option [ability]='auth.ability()' [count]='-1' [route]='crud.route' [load]='crud.load' 
    (delete)='crud.delete().subscribe()'></app-view-option>

    <div class='row mat-card p-2 mb-2'>
      <div class='col-sm-6'>
        <div class='mb-1'><b>{{ 'name'|translate }}</b> <br> {{ item.name }}</div>
      </div>
      <div class='col-sm-6'>
        <div class='mb-1'><b>{{ 'department'|translate }}</b> <br> {{ item.department?.name }}</div>
      </div>
    </div>
  `
})
export class CityShowComponent implements OnInit {

  item = new City();

  constructor(
    private activatedRoute: ActivatedRoute,
    public router: Router,
    public auth: AuthService,
    public crud: CrudService
  ) {
    this.crud.route.path = 'city';
    this.crud.route.id = this.activatedRoute.snapshot.params?.id;
  }

  ngOnInit(): void {
    this.crud.readOne().pipe(first()).subscribe((item: City) => this.item = item);
  }

}
