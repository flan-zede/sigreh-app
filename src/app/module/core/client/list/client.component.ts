import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { finalize, first } from 'rxjs/operators';

import { Feature } from 'src/app/enum';
import { PageInterface, PageResponseInterface, RouteInterface } from 'src/app/interface';
import { City, Department, Establishment, Region, User } from 'src/app/model';
import { ApiService, AuthService, DialogService } from 'src/app/service';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html'
})
export class ClientComponent implements OnInit {

  load: boolean;
  route: RouteInterface = { path: Feature.Client, id: null };
  page: PageInterface = { index: 1, size: 10, length: 0, sizeOptions: [], showFirstLastButtons: true };
  search = '';
  items: City[] = [];
  user: User;
  regions: Region[] = [];
  departments: Department[] = [];
  cities: City[] = [];
  establishments: Establishment[] = [];
  step: number;

  constructor(
    public router: Router,
    private dialog: DialogService,
    public auth: AuthService,
    public api: ApiService
  ) {
    this.route = { path: Feature.Client, id: null };
    this.user = this.auth.getCredential()?.user;
  }

  ngOnInit(): void {
    this.read(this.page, this.search);
    this.auth.permissions(Feature.Client);
  }

  read(page: PageInterface, search: string): void {
    this.items = [];
    const establishmentId = localStorage.getItem('establishmentId');
    if (establishmentId) {
      this.load = true;
      this.api.get(`${this.route.path}/establishment/${establishmentId}`, `sort=asc&index=${page.index}&size=${page.size}&search=${search}`)
        .pipe(first(), finalize(() => this.load = false))
        .subscribe((item: PageResponseInterface) => this.items = item.data);
    }
  }

  delete(id: number): void {
    this.dialog.confirm('Voulez-vous supprimer cet enregistrement ?').subscribe((res: boolean) => {
      if (res) {
        this.api.delete(this.route.path, id).pipe(first()).subscribe(() => this.items = this.items.filter(item => item.id !== id));
      }
    });
  }

  getDepartments(id: number): void {
    this.load = true;
    this.api.get(`department/region/${id}`).pipe(first(), finalize(() => this.load = false))
      .subscribe((items: Department[]) => this.departments = items);
  }

  getCities(id: number): void {
    this.load = true;
    this.api.get(`city/department/${id}`).pipe(first(), finalize(() => this.load = false))
      .subscribe((items: City[]) => this.cities = items);
  }

  getEstablishments(id: number): void {
    this.load = true;
    this.api.get(`establishment/city/${id}`).pipe(first(), finalize(() => this.load = false))
      .subscribe((items: Establishment[]) => this.establishments = items);
  }

  getClients(id: number): void {
    localStorage.setItem('establishmentId', id.toString());
    this.read(this.page, '');
  }

  filter(): void {
    if (['REH', 'GEH'].includes(this.user?.role)) {
      this.step = 4;
      this.establishments = this.establishments.length === 0 ? this.user?.establishments : this.establishments;
    }
    else if (['DDMT', 'PP'].includes(this.user?.role)) {
      this.step = 2;
      this.departments = this.departments.length === 0 ? this.user?.departments : this.departments;
    }
    else {
      this.step = 1;
      if (this.user?.role === 'DRMT') {
        this.regions = this.regions.length === 0 ? this.user?.regions : this.regions;
      }
      else {
        this.load = true;
        this.api.getAll('region', 'sort=asc').pipe(first(), finalize(() => this.load = false))
          .subscribe((items: Region[]) => this.regions = items);
      }
    }
  }

  trackFn = (i: number, res: any) => res.id;

}
