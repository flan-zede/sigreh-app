import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, startWith, finalize, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';

import { AuthService, AlertService } from 'src/app/service';
import { ROUTE } from 'src/app/shared/constant';
import { AuthResponseInterface, LoginInterface, PatchInterface, RelationshipInterface, RouteInterface } from 'src/app/shared/interface';
import { City, Client, Department, Establishment, Partner, Region, User } from 'src/app/model';

interface CrudResponseInterface extends City, Client, Department, Establishment, Partner, Region, User { }

@Injectable({ providedIn: 'root' })
export class CrudService {

  form: FormGroup;
  defaultForm: FormGroup;
  route: RouteInterface = ROUTE;
  load: boolean = false;

  constructor(
    private http: HttpClient,
    private trans: TranslateService,
    private auth: AuthService,
    private alert: AlertService
  ) { }

  loader() {
    this.load = !this.load;
  }

  succeed() {
    this.alert.success();
  }

  catchError(error: HttpErrorResponse): Observable<any> {
    this.alert.error(error);
    return of();
  }

  createForm() {
    this.form = this.defaultForm;
  }

  readOne(id?: number): Observable<any> {
    id = id ? id : this.route.id;
    return this.http.get(`${environment.api}/${this.route.path}/${id}`)
      .pipe(
        tap(res => {
          if (this.form) this.form.patchValue(res);
          return res;
        }),
        startWith(() => this.loader()),
        finalize(() => this.loader()),
        catchError(err => this.catchError(err))
      );
  }

  read(): Observable<any> {
    return this.http.get(`${environment.api}/${this.route.path}${this.queryParam()}`)
      .pipe(
        startWith(() => this.loader()),
        finalize(() => this.loader()),
        catchError(err => this.catchError(err))
      );
  }

  readAll(path?: string): Observable<any> {
    path = path ? path : this.route.path;
    return this.http.get(`${environment.api}/${path}?sort=asc`)
      .pipe(
        startWith(() => this.loader()),
        finalize(() => this.loader()),
        catchError(err => this.catchError(err))
      );
  }

  readMultiple(ids: string): Observable<any> {
    return this.http.get(`${environment.api}/${this.route.path}/multiple/${ids}`)
      .pipe(
        startWith(() => this.loader()),
        finalize(() => this.loader()),
        catchError(err => this.catchError(err))
      );
  }

  create(data?: any): Observable<any> {
    data = data ? data : this.form.value;
    return this.http.post(`${environment.api}/${this.route.path}`, data)
      .pipe(
        tap((res: CrudResponseInterface) => {
          this.route.id = res.id;
          this.relate();
          this.createForm();
          this.succeed();
          return res;
        }),
        startWith(() => this.loader()),
        finalize(() => this.loader()),
        catchError(err => this.catchError(err))
      );
  }

  update(data?: any): Observable<any> {
    data = data ? data : this.form.value;
    return this.http.put(`${environment.api}/${this.route.path}/${this.route.id}`, data)
      .pipe(
        tap(res => {
          this.relate();
          this.createForm();
          this.succeed();
          return res;
        }),
        startWith(() => this.loader()),
        finalize(() => this.loader()),
        catchError(err => this.catchError(err))
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
                  return this.http.delete(`${environment.api}/${this.route.path}/${id}`)
                    .pipe(
                      tap(_ => this.succeed()),
                      startWith(() => this.loader()),
                      finalize(() => this.loader()),
                      catchError(err => this.catchError(err))
                    );
                }
                else return false;
              })
            );
        })
      );
  }

  relate(relates?: RelationshipInterface[]): void {
    relates = relates ? relates : this.route.relates;
    relates.forEach(data => this.http.post(`${environment.api}/${this.route.path}/${this.route.id}/relate`, data));

  }

  patch(data?: PatchInterface[]): Observable<any> {
    data = data ? data : this.route.patches;
    return this.http.patch(`${environment.api}/${this.route.path}/${this.route.id}`, data)
      .pipe(
        tap(_ => this.succeed()),
        startWith(() => this.loader()),
        finalize(() => this.loader()),
        catchError(err => this.catchError(err))
      );
  }

  login(data?: LoginInterface): Observable<any> {
    data = data ? data : this.form.value;
    return this.http.post<AuthResponseInterface>(`${environment.api}/user/login`, data)
      .pipe(
        tap(res => this.auth.setCredential(res)),
        startWith(() => this.loader()),
        finalize(() => this.loader()),
        catchError(err => this.catchError(err))
      );
  }

  readMe(): Observable<any> {
    return this.http.get(`${environment.api}/user/me`)
    .pipe(
      startWith(() => this.loader()),
      finalize(() => this.loader()),
      catchError(err => this.catchError(err))
    );
  }
  
  queryParam() {
    var query: string = '';
    query = query + `?sort=${this.route.sort}`;
    query = this.route.page.index ? query + `&index=${this.route.page.index}` : query;
    query = this.route.page.size ? query + `&size=${this.route.page.size}` : query;
    query = this.route.search ? query + `&search=${this.route.search}` : query;
    return query;
  }

  trackFn = (i: number, res: any) => res.id;

}
