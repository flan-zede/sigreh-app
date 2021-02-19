import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { RouteInterface, PatchInterface, RelationInterface } from 'src/app/shared/interface/app.interface';

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

  findMultiple(route: RouteInterface): Observable<any> {
    return this.http.get(`${environment.api}/${route.path}/multiple/${route.ids}`);
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

  related(route: RouteInterface, data: RelationInterface): Observable<any> {
    return this.http.post(`${environment.api}/${route.path}/relation`, data);
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
