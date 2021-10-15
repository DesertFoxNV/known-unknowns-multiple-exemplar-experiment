import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { TrialCorrectDialogComponent } from './trial-correct-dialog.component';

@NgModule({
  declarations: [TrialCorrectDialogComponent],
  exports: [TrialCorrectDialogComponent],
  imports: [
    CommonModule,
    MatRippleModule
  ]
})
export class TrialCorrectDialogModule {}
