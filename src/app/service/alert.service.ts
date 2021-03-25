import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class AlertService {

  constructor(
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

}
