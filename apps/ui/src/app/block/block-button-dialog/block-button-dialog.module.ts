import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { BlockButtonDialogComponent } from './block-button-dialog.component';

@NgModule({
  declarations: [BlockButtonDialogComponent],
  exports: [BlockButtonDialogComponent],
  imports: [
    CommonModule,
    MatRippleModule
  ]
})
export class BlockButtonDialogModule {}
