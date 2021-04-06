import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { finalize, first } from 'rxjs/operators';

import { IDNUMBER_NATURE, GENDER, NATIONALITY, PHONE_TYPE, ROLE } from 'src/app/constant';
import { Feature } from 'src/app/enum';
import { ManyToManyInterface, RouteInterface } from 'src/app/interface';
import { Department, Establishment, Region, User } from 'src/app/model';
import { DialogService, ApiService, AuthService, UtilService } from 'src/app/service';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html'
})
export class UserDialogComponent implements OnInit {

  load: boolean;
  hide: boolean;
  route: RouteInterface;
  form: FormGroup;
  maxBirthdate: Date = new Date(new Date().getFullYear() - 20, 0, 1);
  readonly role = ROLE;
  readonly idnumberNature = IDNUMBER_NATURE;
  readonly gender = GENDER;
  readonly nationality = NATIONALITY;
  readonly phoneType = PHONE_TYPE;

  regions: Region[] = [];
  regionsTemp: Region[] = [];
  departments: Department[] = [];
  departmentsTemp: Department[] = [];
  establishments: Establishment[] = [];
  establishmentsTemp: Establishment[] = [];

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public router: Router,
    private dialog: DialogService,
    public auth: AuthService,
    public api: ApiService,
    private util: UtilService
  ) {
    this.route = { path: Feature.User, id: this.activatedRoute.snapshot.params?.id };
    this.form = this.fb.group({
      firstname: ['', Validators.compose([Validators.required])],
      name: ['', Validators.compose([Validators.required])],
      birthdate: ['', Validators.compose([Validators.required])],
      gender: ['', Validators.compose([Validators.required])],
      nationality: ['', Validators.compose([Validators.required])],
      idnumber: ['', Validators.compose([Validators.required])],
      idnumberNature: ['', Validators.compose([Validators.required])],
      phoneType: ['', Validators.compose([Validators.required])],
      phone: ['', Validators.compose([Validators.required])],
      username: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(45)])],
      email: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(45)])],
      confirmPassword: ['', Validators.compose([Validators.required])],
      active: [true],
      role: ['', Validators.compose([Validators.required])],
      regions: [[]],
      departments: [[]],
      establishments: [[]],
    });
    this.hide = true;
  }

  ngOnInit(): void {
    forkJoin({
      regions: this.api.getAll('region', 'sort=asc'),
      departments: this.api.getAll('department', 'sort=asc'),
      establishments: this.api.getAll('establishment', 'sort=asc')
    }).pipe(first())
      .subscribe((res: any) => {
        this.regions = res.regions;
        this.departments = res.departments;
        this.establishments = res.establishments;
      });
    if (this.route.id) {
      this.load = true;
      this.api.get(`${this.route.path}/${this.route.id}`).pipe(first(), finalize(() => this.load = false))
        .subscribe((item: User) => {
          this.regionsTemp = item.regions;
          this.departmentsTemp = item.departments;
          this.establishmentsTemp = item.establishments;
          this.form.patchValue(item);
        });
    }
    this.auth.permissions(Feature.User);
  }

  create(): void {
    this.load = true;
    this.api.post(this.route.path, this.form.value).pipe(first(), finalize(() => this.load = false))
      .subscribe((item: User) => {
        this.relate(item);
        this.dialog.success();
        this.router.navigate([`${this.route.path}/read/${item.id}`]);
      });
  }

  update(): void {
    this.load = true;
    this.api.put(this.route.path, this.route.id, this.form.value).pipe(first(), finalize(() => this.load = false))
      .subscribe((item: User) => { this.relate(item); this.dialog.success(); });
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

  relate(item: User): void {
    this.util.arrayDiff('region', this.regionsTemp, this.form.value.regions).forEach((data: ManyToManyInterface) =>
      this.api.post(`${this.route.path}/${item.id}/relate`, data).subscribe()
    );
    this.util.arrayDiff('department', this.departmentsTemp, this.form.value.departments).forEach((data: ManyToManyInterface) =>
      this.api.post(`${this.route.path}/${item.id}/relate`, data).subscribe()
    );
    this.util.arrayDiff('establishment', this.establishmentsTemp, this.form.value.establishments).forEach((data: ManyToManyInterface) =>
      this.api.post(`${this.route.path}/${item.id}/relate`, data).subscribe()
    );
  }

  region(): void {
    this.dialog.select(this.regions, this.form.value.regions)
      .subscribe((regions: any) => this.form.patchValue({ regions }));
  }

  department(): void {
    this.dialog.select(this.departments, this.form.value.departments)
      .subscribe((departments: any) => this.form.patchValue({ departments }));
  }

  establishment(): void {
    this.dialog.select(this.establishments, this.form.value.establishments, false)
      .subscribe((establishments: any) => this.form.patchValue({ establishments }));
  }

}
