import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TrialStimulusComponent } from './trial-stimulus.component';

@NgModule({
  declarations: [
    TrialStimulusComponent
  ],
  exports: [
    TrialStimulusComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule
  ]
})
export class TrialStimulusModule {}
