import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { SurveyDialogComponent } from './survey-dialog.component';
import { SurveyService } from './survey.service';

@NgModule({
  declarations: [
    SurveyDialogComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  providers: [
    SurveyService
  ]
})
export class SurveyModule {}
