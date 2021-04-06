import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { finalize, first } from 'rxjs/operators';

import { Feature } from 'src/app/enum';
import { ESTABLISHMENT_NATURE } from 'src/app/constant';
import { RouteInterface } from 'src/app/interface';
import { Establishment } from 'src/app/model';
import { ApiService, AuthService, DialogService } from 'src/app/service';

@Component({
  selector: 'app-establishment-dialog',
  templateUrl: './establishment-dialog.component.html'
})
export class EstablishmentDialogComponent implements OnInit {

  load: boolean;
  route: RouteInterface;
  form: FormGroup;
  cities: Establishment[] = [];
  readonly establishmentNature = ESTABLISHMENT_NATURE;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public router: Router,
    private dialog: DialogService,
    public auth: AuthService,
    public api: ApiService
  ) {
    this.route = { path: Feature.Establishment, id: this.activatedRoute.snapshot.params?.id };
    this.form = this.fb.group({
      name: ['', Validators.compose([Validators.required])],
      nature: ['', Validators.compose([Validators.required])],
      cityId: ['', Validators.compose([Validators.required])],
      municipality: [''],
      location: ['']
    });
  }

  ngOnInit(): void {
    forkJoin({ cities: this.api.getAll('city', 'sort=asc') }).pipe(first()).subscribe((res: any) => this.cities = res.cities);
    if (this.route.id) {
      this.load = true;
      this.api.get(`${this.route.path}/${this.route.id}`).pipe(first(), finalize(() => this.load = false))
        .subscribe((item: Establishment) => this.form.patchValue(item));
    }
    this.auth.permissions(Feature.Establishment);
  }

  create(): void {
    this.load = true;
    this.api.post(this.route.path, this.form.value).pipe(first(), finalize(() => this.load = false))
      .subscribe((item: Establishment) => {
        this.dialog.success();
        this.router.navigate([`${this.route.path}/read/${item.id}`]);
      });
  }

  update(): void {
    this.load = true;
    this.api.put(this.route.path, this.route.id, this.form.value).pipe(first(), finalize(() => this.load = false))
      .subscribe(() => this.dialog.success());
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
