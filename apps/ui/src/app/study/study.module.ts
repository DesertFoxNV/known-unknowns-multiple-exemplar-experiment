import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';

import { StudyRoutingModule } from './study-routing.module';
import { StudyComponent } from './study.component';
import { TrialButtonModule } from './trial-button/trial-button.module';
import { TrialCueModule } from './trial-cue/trial-cue.module';
import { TrialModule } from './trial/trial.module';

@NgModule({
  declarations: [
    StudyComponent
  ],
  imports: [
    CommonModule,
    StudyRoutingModule,
    TrialModule
  ]
})
export class StudyModule {}
