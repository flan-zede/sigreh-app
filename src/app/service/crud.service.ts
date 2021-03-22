import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';

import { AuthService } from './auth.service';
import { AlertService } from './alert.service';
import { ROUTE } from 'src/app/constant';
import { AuthResponseInterface, LoginInterface, PatchInterface, RouteInterface } from 'src/app/interface';
import { City, Client, Department, Establishment, Partner, Region, User } from 'src/app/model';

interface CrudResponseInterface extends City, Client, Department, Establishment, Partner, Region, User { }

@Injectable({ providedIn: 'root' })
export class CrudService {

  form: FormGroup;
  defaultForm: FormGroup;
  route: RouteInterface = ROUTE;
  load = false;

  constructor(
    private http: HttpClient,
    private trans: TranslateService,
    private auth: AuthService,
    private alert: AlertService
  ) { }

  loader(): void {
    this.load = !this.load;
  }

  succeed(): void {
    this.alert.success();
  }

  catchError(error: HttpErrorResponse): Observable<any> {
    this.alert.error(error);
    return of();
  }

  createForm(): void {
    this.form = this.defaultForm;
  }

  readOne(id?: number): Observable<any> {
    id = id ? id : this.route.id;
    this.loader();
    return this.http.get(`${environment.api}/${this.route.path}/${id}`)
      .pipe(
        tap((res: CrudResponseInterface) => {
          if (this.form) { this.form.patchValue(res); }
          return res;
        }),
        finalize(() => this.loader()),
        catchError((err: HttpErrorResponse) => this.catchError(err))
      );
  }

  read(): Observable<any> {
    this.loader();
    return this.http.get(`${environment.api}/${this.route.path}${this.queryParam()}`)
      .pipe(
        finalize(() => this.loader()),
        catchError((err: HttpErrorResponse) => this.catchError(err))
      );
  }

  readAll(path?: string): Observable<any> {
    path = path ? path : this.route.path;
    this.loader();
    return this.http.get(`${environment.api}/${path}?sort=asc`)
      .pipe(
        finalize(() => this.loader()),
        catchError((err: HttpErrorResponse) => this.catchError(err))
      );
  }

  readMultiple(ids: string): Observable<any> {
    this.loader();
    return this.http.get(`${environment.api}/${this.route.path}/multiple/${ids}`)
      .pipe(
        finalize(() => this.loader()),
        catchError((err: HttpErrorResponse) => this.catchError(err))
      );
  }

  create(data?: any): Observable<any> {
    data = data ? data : this.form.value;
    this.loader();
    return this.http.post(`${environment.api}/${this.route.path}`, data)
      .pipe(
        tap((res: CrudResponseInterface) => {
          this.route.id = res.id;
          this.relate();
          this.createForm();
          this.succeed();
          return res;
        }),
        finalize(() => this.loader()),
        catchError((err: HttpErrorResponse) => this.catchError(err))
      );
  }

  update(data?: any): Observable<any> {
    data = data ? data : this.form.value;
    this.loader();
    return this.http.put(`${environment.api}/${this.route.path}/${this.route.id}`, data)
      .pipe(
        tap(res => {
          console.log('on update');
          this.relate();
          this.createForm();
          this.succeed();
          return res;
        }),
        finalize(() => this.loader()),
        catchError((err: HttpErrorResponse) => this.catchError(err))
      );
  }

  delete(id?: number): Observable<any> {
    return this.trans.stream('alert-message.delete')
      .pipe(
        tap(text => {
          return this.alert.confim(text)
            .pipe(
              tap((res: boolean) => {
                if (res) {
                  id = id ? id : this.route.id;
                  this.loader();
                  return this.http.delete(`${environment.api}/${this.route.path}/${id}`)
                    .pipe(
                      tap(_ => this.succeed()),
                      finalize(() => this.loader()),
                      catchError((err: HttpErrorResponse) => this.catchError(err))
                    );
                }
                else { return false; }
              })
            );
        })
      );
  }

  relate(): void {
    console.log('in relate');
    this.route.oneToMany.forEach(data => {
      if (data.value.id) { this.http.delete(`${environment.api}/${data.table}/${data.value.id}`).subscribe(); }
      else { this.http.post(`${environment.api}/${data.table}`, { ...data.value, clientId: this.route.id }).subscribe(); }
    });
    this.route.manyToMany.forEach(data => {
      this.http.post(`${environment.api}/${this.route.path}/${this.route.id}/relate`, data).subscribe();
    });
  }

  patch(data?: PatchInterface[]): Observable<any> {
    data = data ? data : this.route.patch;
    this.loader();
    return this.http.patch(`${environment.api}/${this.route.path}/${this.route.id}`, data)
      .pipe(
        tap(_ => this.succeed()),
        finalize(() => this.loader()),
        catchError((err: HttpErrorResponse) => this.catchError(err))
      );
  }

  login(data?: LoginInterface): Observable<any> {
    data = data ? data : this.form.value;
    this.loader();
    return this.http.post(`${environment.api}/user/login`, data)
      .pipe(
        tap((res: AuthResponseInterface) => this.auth.setCredential(res)),
        finalize(() => this.loader()),
        catchError((err: HttpErrorResponse) => this.catchError(err))
      );
  }

  readMe(): Observable<any> {
    this.loader();
    return this.http.get(`${environment.api}/user/me`)
      .pipe(
        finalize(() => this.loader()),
        catchError((err: HttpErrorResponse) => this.catchError(err))
      );
  }

  queryParam(): string {
    let query = '';
    query = query + `?sort=${this.route.sort}`;
    query = this.route.page.index ? query + `&index=${this.route.page.index}` : query;
    query = this.route.page.size ? query + `&size=${this.route.page.size}` : query;
    query = this.route.search ? query + `&search=${this.route.search}` : query;
    return query;
  }

  trackFn = (i: number, res: any) => res.id;

  pepare(type: string, table: string, next: any, old?: any): void {
    this.route.oneToMany = [];
    this.route.manyToMany = [];
    let exist = false;

    switch (type) {
      case 'one': this.route.oneToMany.push({ table, value: next }); break;
      case 'many': {

        next.forEach((n: any) => {
          exist = false;
          old.forEach((o: any) => { if (o.id === n.id) { exist = true; } });
          if (exist === false) { this.route.manyToMany.push({ table, id: n.id, add: true } ); }
        });

        old.forEach((o: any) => {
          exist = false;
          next.forEach((n: any) => { if (o.id === n.id) { exist = true; } });
          if (exist === false) { this.route.manyToMany.push({ table, id: o.id, add: false }); }
        });
      }            break;
      default: break;
    }

  }

}
