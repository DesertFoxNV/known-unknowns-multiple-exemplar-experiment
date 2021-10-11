import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TrialStimulusComponent } from './trial-stimulus.component';

@NgModule({
  declarations: [
    TrialStimulusComponent
  ],
  exports: [
    TrialStimulusComponent
  ],
  imports: [
    CommonModule
  ]
})
export class TrialStimulusModule {}
