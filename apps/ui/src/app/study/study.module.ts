import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { StudyRoutingModule } from './study-routing.module';
import { StudyComponent } from './study.component';
import { TrialModule } from '../trial/trial.module';

@NgModule({
  declarations: [
    StudyComponent
  ],
  imports: [
    CommonModule,
    StudyRoutingModule,
    TrialModule,
    MatButtonModule
  ]
})
export class StudyModule {}
