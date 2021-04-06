import { ComponentType } from '@angular/cdk/portal';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { ConfirmComponent, SelectComponent } from 'src/app/module/shared/component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  readonly config = {
    disableClose: false,
    minHeight: '100vh',
    minWidth: '100vw',
    autoFocus: false
  };

  constructor(
    protected dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  success(text?: string): void {
    const message = text ? text : 'Saved';
    this.snackBar.open(message, 'x', { panelClass: 'bg-success', duration: 5000 });
  }

  error(error: HttpErrorResponse): void {
    const message = (error.error instanceof ErrorEvent) ? error.error.message : `${error.status}: ${error.message}`;
    this.snackBar.open(message, 'x', { panelClass: 'bg-danger', duration: 5000 });
  }

  info(message: string): void {
    this.snackBar.open(message, 'x', { panelClass: 'bg-primary', duration: 5000 });
  }

  open<modalType>(component: ComponentType<modalType>, data: any = {}, fullWidth = true): Observable<any> {
    if (fullWidth) {
      return this.dialog.open(component, { ...this.config, data }).afterClosed();
    }
    else {
      return this.dialog.open(component, { data }).afterClosed();
    }
  }

  select(list: any, select: any, multiple = true): Observable<any> {
    return this.dialog.open(SelectComponent, { ...this.config, data: { list, select, multiple } }).afterClosed();
  }

  confirm(message: string): Observable<any> {
    return this.dialog.open(ConfirmComponent, { data: { message } }).afterClosed();
  }

}
