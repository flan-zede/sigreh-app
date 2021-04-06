import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PatchInterface } from 'src/app/interface';
import { environment } from 'src/environments/environment';
import { DialogService } from '../dialog/dialog.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient,
    private dialog: DialogService
  ) {}

  get(path: string, query: string = ''): Observable<any> {
    return this.http.get(`${environment.api}/${path}?${query}`).pipe(
      catchError((err: HttpErrorResponse) => { this.dialog.error(err); return of(); })
    );
  }

  getAll(path: string, query: string = ''): Observable<any> {
    return this.http.get(`${environment.api}/${path}/all?${query}`).pipe(
      catchError((err: HttpErrorResponse) => { this.dialog.error(err); return of(); })
    );
  }

  post(path: string, data: any): Observable<any> {
    return this.http.post(`${environment.api}/${path}`, data).pipe(
      catchError((err: HttpErrorResponse) => { this.dialog.error(err); return of(); })
    );
  }

  put(path: string, id: number, data: any): Observable<any> {
    return this.http.put(`${environment.api}/${path}/${id}`, data).pipe(
      catchError((err: HttpErrorResponse) => { this.dialog.error(err); return of(); })
    );
  }

  patch(path: string, id: number, data: PatchInterface[]): Observable<any> {
    return this.http.patch(`${environment.api}/${path}/${id}`, data).pipe(
      catchError((err: HttpErrorResponse) => { this.dialog.error(err); return of(); })
    );
  }

  delete(path: string, id: number): Observable<any> {
    return this.http.delete(`${environment.api}/${path}/${id}`).pipe(
      catchError((err: HttpErrorResponse) => { this.dialog.error(err); return of(); })
    );
  }

}
