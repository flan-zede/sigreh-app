import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { AuthService, CrudService } from 'src/app/service';
import { Establishment } from 'src/app/model/establishment.model';
import { ESTABLISHMENT_NATURE } from 'src/app/shared/constant';

@Component({
  selector: 'app-establishment-show',
  template: `
    <app-view-option [ability]='auth.ability()' [count]='-1' [route]='crud.route' [load]='crud.load' 
    (delete)='crud.delete().subscribe()'></app-view-option>

    <div class='row mb-2'>
      <div class='col-sm-6'>
        <div class='mb-1'><b>{{ 'name'|translate }}</b> <br> {{ item.name }}</div>
        <div class='mb-1'><b>{{ 'nature'|translate }}</b> <div *ngFor='let p of establishment_nature'><span *ngIf='p.id == item.nature'>{{ p.name }}</span></div></div>
      </div>
      <div class='col-sm-6'>
        <div class='mb-1'><b>{{ 'city'|translate }}</b> <br> {{ item.city?.name }}</div>
        <div class='mb-1'><b>{{ 'municipality'|translate }}</b> <br> {{ item.municipality }}</div>
      </div>
      <div class='col-sm-6'>
        <div class='mb-1'><b>{{ 'location'|translate }}</b> <br> {{ item.location }}</div>
      </div>
    </div>
  `
})
export class EstablishmentShowComponent implements OnInit {

  item = new Establishment();
  readonly establishment_nature = ESTABLISHMENT_NATURE;

  constructor(
    private activatedRoute: ActivatedRoute,
    public router: Router,
    public auth: AuthService,
    public crud: CrudService
  ) {
    this.crud.route.path = 'establishment';
    this.crud.route.id = this.activatedRoute.snapshot.params?.id;
  }

  ngOnInit(): void {
    this.crud.readOne().pipe(first()).subscribe((item: Establishment) => this.item = item);
  }

}
