import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

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
    MatButtonModule,
    MatCardModule,
    FlexLayoutModule
  ]
})
export class StudyModule {}
