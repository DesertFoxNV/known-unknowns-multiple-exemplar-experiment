import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { TrialFeedbackDialogComponent } from './trial-feedback-dialog.component';

@NgModule({
  declarations: [TrialFeedbackDialogComponent],
  exports: [TrialFeedbackDialogComponent],
  imports: [
    CommonModule,
    MatRippleModule
  ]
})
export class TrialCorrectDialogModule {}
