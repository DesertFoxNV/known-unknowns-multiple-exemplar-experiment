import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { TrialCorrectDialogModule } from './trial-correct/trial-correct-dialog.module';
import { TrialCueModule } from './trial-cue/trial-cue.module';
import { TrialStimulusModule } from './trial-stimulus/trial-stimulus.module';
import { TrialComponent } from './trial.component';

@NgModule({
  declarations: [
    TrialComponent
  ],
  exports: [
    TrialComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    TrialCorrectDialogModule,
    TrialCueModule,
    TrialStimulusModule
  ]
})
export class TrialModule {}
