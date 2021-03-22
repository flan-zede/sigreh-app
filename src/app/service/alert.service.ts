import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

import { AlertConfirmComponent } from 'src/app/module/shared/component';

@Injectable({ providedIn: 'root' })
export class AlertService {

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    public trans: TranslateService
  ) { }

  success(text?: string): void {
    const message = text ? text : 'Saved';
    this.snackBar.open(message, 'x', { panelClass: 'bg-success', duration: 5000 });
  }

  error(error: HttpErrorResponse): void {
    try {
      const message = (error.error instanceof ErrorEvent) ? error.error.message : `${error.status}: ${error.message}`;
      this.snackBar.open(message, 'x', { panelClass: 'bg-danger', duration: 5000 });
    }
    catch (e) { }
  }

  info(message: string): void {
    this.snackBar.open(message, 'x', { panelClass: 'bg-primary', duration: 5000 });
  }

  confim(message: string): Observable<boolean> {
    return this.dialog.open(AlertConfirmComponent, { data: { message } }).afterClosed();
  }

}
