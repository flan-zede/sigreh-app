import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { finalize, first } from 'rxjs/operators';

import { ESTABLISHMENT_NATURE } from 'src/app/constant';
import { Feature } from 'src/app/enum';
import { PageInterface, PageResponseInterface, RouteInterface } from 'src/app/interface';
import { Establishment } from 'src/app/model';
import { ApiService, AuthService, DialogService } from 'src/app/service';

@Component({
  selector: 'app-establishment',
  templateUrl: './establishment.component.html'
})
export class EstablishmentComponent implements OnInit {

  load: boolean;
  route: RouteInterface = { path: Feature.Establishment, id: null };
  page: PageInterface = { index: 1, size: 10, length: 0, sizeOptions: [], showFirstLastButtons: true };
  search = '';
  items: Establishment[] = [];
  readonly establishmentNature = ESTABLISHMENT_NATURE;

  constructor(
    public router: Router,
    private dialog: DialogService,
    public auth: AuthService,
    public api: ApiService
  ) { }

  ngOnInit(): void {
    this.read(this.page, this.search);
    this.auth.permissions(Feature.Establishment);
  }

  read(page: PageInterface, search: string): void {
    this.items = [];
    this.load = true;
    this.api.get(this.route.path, `sort=desc&index=${page.index}&size=${page.size}&search=${search}`)
      .pipe(first(), finalize(() => this.load = false))
      .subscribe((item: PageResponseInterface) => this.items = item.data);
  }

  delete(id: number): void {
    this.dialog.confirm('Voulez-vous supprimer cet enregistrement ?').subscribe((res: boolean) => {
      if (res) {
        this.api.delete(this.route.path, id).pipe(first()).subscribe(() => this.items = this.items.filter(item => item.id !== id));
      }
    });
  }

  trackFn = (i: number, res: any) => res.id;

}
