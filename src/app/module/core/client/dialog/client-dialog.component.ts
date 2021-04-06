import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, first } from 'rxjs/operators';

import { Feature } from 'src/app/enum';
import { PartnerComponent } from 'src/app/module/shared/component';
import { IDNUMBER_NATURE, BEDROOM_TYPE, OCCUPATION_TYPE, GENDER, NATIONALITY, PHONE_TYPE } from 'src/app/constant';
import { RouteInterface } from 'src/app/interface';
import { Client, Partner, User } from 'src/app/model';
import { ApiService, AuthService, DialogService } from 'src/app/service';

@Component({
  selector: 'app-client-dialog',
  templateUrl: './client-dialog.component.html'
})
export class ClientDialogComponent implements OnInit {

  load: boolean;
  route: RouteInterface;
  form: FormGroup;
  user: User;
  minEnterdate: Date = new Date();
  maxBirthdate: Date = new Date(new Date().getFullYear() - 20, 0, 1);
  readonly idnumberNature = IDNUMBER_NATURE;
  readonly bedroomType = BEDROOM_TYPE;
  readonly occupationType = OCCUPATION_TYPE;
  readonly gender = GENDER;
  readonly nationality = NATIONALITY;
  readonly phoneType = PHONE_TYPE;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public router: Router,
    private dialog: DialogService,
    public auth: AuthService,
    public api: ApiService
  ) {
    this.route = { path: Feature.Client, id: this.activatedRoute.snapshot.params?.id };
    this.user = this.auth.getCredential()?.user;
    this.form = this.fb.group({
      firstname: ['', Validators.compose([Validators.required])],
      name: ['', Validators.compose([Validators.required])],
      birthdate: ['', Validators.compose([Validators.required])],
      gender: ['', Validators.compose([Validators.required])],
      nationality: ['', Validators.compose([Validators.required])],
      idnumber: ['', Validators.compose([Validators.required])],
      idnumberNature: ['', Validators.compose([Validators.required])],
      phoneType: ['', Validators.compose([Validators.required])],
      phone: ['', Validators.compose([Validators.required, Validators.minLength(10)])],
      occupationType: ['', Validators.compose([Validators.required])],
      numberOfNights: [1, Validators.compose([Validators.required, Validators.min(1)])],
      numberOfHours: [1, Validators.compose([Validators.required, Validators.min(1)])],
      bedroomNumber: ['', Validators.compose([Validators.required])],
      bedroomType: ['', Validators.compose([Validators.required])],
      enterDate: ['', Validators.compose([Validators.required])],
      enterTime: ['', Validators.compose([Validators.required])],
      partners: [[]],
      establishmentId: [this.user?.establishments[0]?.id],
      userId: [this.user?.id]
    });
  }

  ngOnInit(): void {
    if (this.route.id) {
      this.load = true;
      this.api.get(`${this.route.path}/${this.route.id}`).pipe(first(), finalize(() => this.load = false))
        .subscribe((item: Client) => this.form.patchValue(item));
    }
    this.auth.permissions(Feature.Client);
  }

  create(): void {
    this.load = true;
    this.api.post(this.route.path, this.form.value).pipe(first(), finalize(() => this.load = false))
      .subscribe((item: Client) => {
        this.relate(item);
        this.dialog.success();
        this.router.navigate([`${this.route.path}/read/${item.id}`]);
      });
  }

  update(): void {
    this.load = true;
    this.api.put(this.route.path, this.route.id, this.form.value).pipe(first(), finalize(() => this.load = false))
      .subscribe((item: Client) => {
        this.relate(item);
        this.dialog.success();
      });
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

  relate(item: Client): void {
    this.form.value.partners.forEach((p: Partner) => {
      if (!p.id) { this.api.post('partner', { ...p, clientId: item.id }).pipe(first()).subscribe(); }
    });
  }

  partner(index?: number): void {
    if (index != null) {
      this.dialog.confirm('Voulez-vous supprimer cet enregistrement ?').subscribe((res: boolean) => {
        if (res) {
          const t = this.form.value.partners[index];
          if (t.id != null) {
            this.api.delete('partner', t.id).pipe(first()).subscribe(() => this.form.value.partners.splice(index, 1));
          }
          else { this.form.value.partners.splice(index, 1); }
        }
      });
    }
    else {
      this.dialog.open(PartnerComponent).subscribe((p: any) => {
        if (p) {
          const partners = this.form.value.partners.concat(p);
          this.form.patchValue({ partners });
        }
      });
    }
  }

}
