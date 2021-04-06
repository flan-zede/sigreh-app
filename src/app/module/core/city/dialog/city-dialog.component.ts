import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { finalize, first } from 'rxjs/operators';

import { Feature } from 'src/app/enum';
import { RouteInterface } from 'src/app/interface';
import { City, Department } from 'src/app/model';
import { ApiService, AuthService, DialogService } from 'src/app/service';

@Component({
  selector: 'app-city-dialog',
  templateUrl: './city-dialog.component.html'
})
export class CityDialogComponent implements OnInit {

  load: boolean;
  route: RouteInterface;
  form: FormGroup;
  departments: Department[] = [];

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public router: Router,
    private dialog: DialogService,
    public auth: AuthService,
    public api: ApiService
  ) {
    this.route = { path: Feature.City, id: this.activatedRoute.snapshot.params?.id };
    this.form = this.fb.group({
      name: ['', Validators.compose([Validators.required])],
      departmentId: ['', Validators.compose([Validators.required])]
    });
  }

  ngOnInit(): void {
    forkJoin({ departments: this.api.getAll('department', 'sort=asc') }).pipe(first())
      .subscribe((res: any) => this.departments = res.departments);
    if (this.route.id) {
      this.load = true;
      this.api.get(`${this.route.path}/${this.route.id}`).pipe(first(), finalize(() => this.load = false))
        .subscribe((item: City) => this.form.patchValue(item));
    }
    this.auth.permissions(Feature.City);
  }

  create(): void {
    this.load = true;
    this.api.post(this.route.path, this.form.value).pipe(first(), finalize(() => this.load = false))
      .subscribe((item: City) => {
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
