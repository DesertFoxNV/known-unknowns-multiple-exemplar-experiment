import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {
  readonly DURATION_LONG = 10 * 1000;
  readonly DURATION_MEDIUM = 7 * 1000;
  readonly DURATION_SHORT = 4 * 1000;

  constructor(private snackBar: MatSnackBar) {}

  error(message: string, action = 'DISMISS', actionFn = NOOP): MatSnackBarRef<TextOnlySnackBar> {
    const snackBarRef = this.snackBar.open(message, action, { duration: this.DURATION_LONG });
    snackBarRef
      .onAction()
      .pipe(
        tap(() => actionFn()),
        tap(() => snackBarRef.dismiss())
      )
      .subscribe();
    return snackBarRef;
  }

  info(message: string): MatSnackBarRef<TextOnlySnackBar> {
    return this.snackBar.open(message, 'OK', { duration: this.DURATION_SHORT });
  }

  open(
    message: string,
    action = undefined,
    config: MatSnackBarConfig = { duration: this.DURATION_SHORT }
  ): MatSnackBarRef<TextOnlySnackBar> {
    return this.snackBar.open(message, action, config);
  }

  warn(message: string): MatSnackBarRef<TextOnlySnackBar> {
    return this.snackBar.open(message, 'DISMISS', { duration: this.DURATION_MEDIUM });
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
const NOOP: () => void = () => {};
