import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class UiService {
  constructor(private snackBar: MatSnackBar) {
  }

  showSnackBar(message: string, action: string, duration: number) {
    this.snackBar.open(message, action, {
      duration
    });
  }
}
