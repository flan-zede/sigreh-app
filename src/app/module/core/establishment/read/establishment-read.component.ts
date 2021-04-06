import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, first } from 'rxjs/operators';

import { ESTABLISHMENT_NATURE } from 'src/app/constant';
import { Feature } from 'src/app/enum';
import { RouteInterface } from 'src/app/interface';
import { Establishment } from 'src/app/model';
import { ApiService, AuthService, DialogService } from 'src/app/service';

@Component({
  selector: 'app-establishment-read',
  templateUrl: './establishment-read.component.html'
})
export class EstablishmentReadComponent implements OnInit {

  load: boolean;
  route: RouteInterface;
  item: Establishment;
  readonly establishmentNature = ESTABLISHMENT_NATURE;

  constructor(
    private activatedRoute: ActivatedRoute,
    public router: Router,
    private dialog: DialogService,
    public auth: AuthService,
    public api: ApiService
  ) {
    this.route = { path: Feature.Establishment, id: this.activatedRoute.snapshot.params?.id };
  }

  ngOnInit(): void {
    if (this.route.id) {
      this.load = true;
      this.api.get(`${this.route.path}/${this.route.id}`).pipe(first(), finalize(() => this.load = false))
        .subscribe((item: Establishment) => this.item = item);
    }
    this.auth.permissions(Feature.Establishment);
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
