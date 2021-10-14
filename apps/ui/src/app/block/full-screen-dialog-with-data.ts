import { MatDialogConfig } from '@angular/material/dialog';

export const fullScreenDialogWithData = (data: unknown) => ({
  data,
  disableClose: true,
  hasBackdrop: false,
  closeOnNavigation: true,
  height: '100vh',
  maxHeight: '100vh',
  maxWidth: '100vw',
  panelClass: ['fullscreen-dialog-container', 'animate__animated', 'animate__fadeIn'],
  width: '100vw'
} as MatDialogConfig);
