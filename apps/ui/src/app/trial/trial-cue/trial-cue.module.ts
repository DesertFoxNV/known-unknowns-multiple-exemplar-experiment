import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { TrialCueComponent } from './trial-cue.component';

@NgModule({
  declarations: [
    TrialCueComponent
  ],
  exports: [
    TrialCueComponent
  ],
  imports: [
    CommonModule,
    MatRippleModule
  ]
})
export class TrialCueModule {}
