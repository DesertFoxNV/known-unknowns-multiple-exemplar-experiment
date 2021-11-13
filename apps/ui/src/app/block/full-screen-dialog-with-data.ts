import { MatDialogConfig } from '@angular/material/dialog';

/**
 * Creates a full screen mat dialog studyConfig with a typed data pass through. The dialog
 * cannot be closed manually.
 * @param {T} data
 * @returns {{panelClass: string[], data: T | undefined, closeOnNavigation: boolean, maxHeight: string, hasBackdrop: boolean, width: string, disableClose: boolean, height: string, maxWidth: string}}
 */
export function fullScreenDialogWithData<T = unknown>(data?: T): MatDialogConfig {
  return {
    data,
    disableClose: true,
    hasBackdrop: false,
    closeOnNavigation: true,
    height: '100vh',
    maxHeight: '100vh',
    maxWidth: '100vw',
    panelClass: ['fullscreen-dialog-container', 'animate__animated', 'animate__fadeIn'],
    width: '100vw'
  };
};
