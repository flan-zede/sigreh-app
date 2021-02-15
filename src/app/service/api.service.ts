import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { RouteInterface } from 'src/app/shared/interface/route.interface';
import { PatchInterface } from 'src/app/shared/interface/patch.interface';

@Injectable({ providedIn: 'root' })
export class ApiService {

  constructor(private http: HttpClient) { }

  find(route: RouteInterface): Observable<any> {
    return this.http.get(`${environment.api}/${route.path}${this.queryParam(route)}`);
  }

  findOne(route: RouteInterface): Observable<any> {
    return this.http.get(`${environment.api}/${route.path}/${route.id}`);
  }

  findAll(route: RouteInterface): Observable<any> {
    return this.http.get(`${environment.api}/${route.path}?sort=${route.sort}`);
  }

  create(route: RouteInterface, data: any): Observable<any> {
    return this.http.post(`${environment.api}/${route.path}`, data);
  }

  update(route: RouteInterface, data: any): Observable<any> {
    return this.http.put(`${environment.api}/${route.path}/${route.id}`, data);
  }

  patch(route: RouteInterface, data: PatchInterface[]): Observable<any> {
    return this.http.patch(`${environment.api}/${route.path}/${route.id}`, data);
  }

  delete(route: RouteInterface, id: number): Observable<any> {
    return this.http.delete(`${environment.api}/${route.path}/${id}`);
  }

  queryParam(route: RouteInterface) {
    var query: string = '';
    query = query + `?sort=${route.sort}`;
    query = route.page.index ? query + `&index=${route.page.index}` : query;
    query = route.page.size ? query + `&size=${route.page.size}` : query;
    query = route.search ? query + `&search=${route.search}` : query;
    return query;
  }

}
