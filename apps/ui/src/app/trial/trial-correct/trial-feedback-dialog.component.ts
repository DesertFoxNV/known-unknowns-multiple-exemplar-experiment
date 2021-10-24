import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fadeOut } from '../../animations/fade-out.animation';
import { delay } from '../../trial/delay';
import { FADE_OUT_DURATION } from '../../trial/fade-out-duration';

@Component({
  selector: 'trial-correct-dialog',
  templateUrl: './trial-feedback-dialog.component.html',
  styleUrls: ['./trial-feedback-dialog.component.css'],
  animations: [
    fadeOut({ duration: FADE_OUT_DURATION })
  ]
})
export class TrialFeedbackDialogComponent implements OnInit {
  animated = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: string,
    readonly ref: MatDialogRef<TrialFeedbackDialogComponent>
  ) { }

  async close() {
    this.animated = true;
    await delay(FADE_OUT_DURATION);
    this.ref.close();
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.close().then();
    }, 3000 - FADE_OUT_DURATION);
  }

}
