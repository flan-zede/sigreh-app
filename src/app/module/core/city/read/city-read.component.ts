import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, first } from 'rxjs/operators';

import { City } from 'src/app/model';
import { Feature } from 'src/app/enum';
import { RouteInterface } from 'src/app/interface';
import { ApiService, AuthService, DialogService } from 'src/app/service';

@Component({
  selector: 'app-city-read',
  templateUrl: './city-read.component.html'
})
export class CityReadComponent implements OnInit {

  load: boolean;
  route: RouteInterface;
  item: City;

  constructor(
    private activatedRoute: ActivatedRoute,
    public router: Router,
    private dialog: DialogService,
    public auth: AuthService,
    public api: ApiService
  ) {
    this.route = { path: Feature.City, id: this.activatedRoute.snapshot.params?.id };
  }

  ngOnInit(): void {
    if (this.route.id) {
      this.load = true;
      this.api.get(`${this.route.path}/${this.route.id}`).pipe(first(), finalize(() => this.load = false))
        .subscribe((item: City) => this.item = item);
    }
    this.auth.permissions(Feature.City);
  }

  delete(): void {
    this.dialog.confirm('Voulez-vous supprimer cet enregistrement ?').subscribe((res: boolean) => {
      if (res) {
        this.load = true;
        this.api.delete(this.route.path, this.route.id).pipe(first(), finalize(() => this.load = false))
          .subscribe(() => this.router.navigate([this.route.path]));
      }
    });
  }

}
