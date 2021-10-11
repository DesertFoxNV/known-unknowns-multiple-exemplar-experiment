import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { TrialButtonModule } from './trial-cue/trial-button.module';
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
    TrialStimulusModule,
    TrialButtonModule,
    FlexLayoutModule
  ]
})
export class TrialModule {}
