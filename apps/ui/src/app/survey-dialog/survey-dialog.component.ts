import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface SurveyDialogData {
  survey: 'pre'|'post';
  title: string;
}

@Component({
  selector: 'survey-dialog',
  templateUrl: './survey-dialog.component.html',
  styleUrls: ['./survey-dialog.component.scss']
})
export class SurveyDialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: SurveyDialogData,
    readonly ref: MatDialogRef<SurveyDialogComponent>
  ) { }

}
