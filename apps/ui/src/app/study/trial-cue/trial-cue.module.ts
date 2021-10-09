import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TrialCueComponent } from './trial-cue.component';

@NgModule({
  declarations: [
    TrialCueComponent
  ],
  exports: [
    TrialCueComponent
  ],
  imports: [
    CommonModule
  ]
})
export class TrialCueModule {}
