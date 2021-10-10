import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { TrialButtonModule } from './trial-button/trial-button.module';
import { TrialCueModule } from './trial-cue/trial-cue.module';
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
    TrialCueModule,
    TrialButtonModule,
    FlexLayoutModule
  ]
})
export class TrialModule {}
