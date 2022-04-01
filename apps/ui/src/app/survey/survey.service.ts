import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { fullScreenDialogWithData } from '../block/full-screen-dialog-with-data';
import { SurveyDialogComponent, SurveyDialogData } from './survey-dialog.component';

@Injectable()
export class SurveyService {

  constructor(
    private dialog: MatDialog
  ) { }

  showPostSurvey(participantId: string): Observable<void> {

    return this.dialog.open(SurveyDialogComponent, fullScreenDialogWithData<SurveyDialogData>(
      {
        title: `Post Survey | Participant Id = ${participantId}`,
        survey: 'post'
      })).afterClosed();
  }

  showPreSurvey(participantId: string): Observable<void> {

    return this.dialog.open(SurveyDialogComponent, fullScreenDialogWithData<SurveyDialogData>(
      {
        title: `Pre Survey`,
        survey: 'pre'
      })).afterClosed();
  }
}
