import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {fadeOut} from '../../animations/fade-out.animation';
import {FADE_OUT_DURATION_MS} from '../../trial/fade-out-duration';
import {FeedBackDialogData} from "./feed-back-dialog.data";
import {timer} from "rxjs";

export const FEEDBACK_TIME_MS = 3000;
export const FEEDBACK_DELAY_MS = FEEDBACK_TIME_MS - FADE_OUT_DURATION_MS;

@Component({
  selector: 'trial-correct-dialog',
  templateUrl: './trial-feedback-dialog.component.html',
  styleUrls: ['./trial-feedback-dialog.component.css'],
  animations: [
    fadeOut({duration: FADE_OUT_DURATION_MS, delay: FEEDBACK_DELAY_MS})
  ]
})
export class TrialFeedbackDialogComponent implements OnInit {
  animated = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: FeedBackDialogData,
    readonly ref: MatDialogRef<TrialFeedbackDialogComponent>
  ) {
  }

  async ngOnInit(): Promise<void> {
    // This delay prevents the a change error by animated changing from true to false
    await timer(0).toPromise()
    this.animated = true;
    /***
     * This delay is used to start the fadeout animation in the trial cue components.
     * Without the delay the transition between feedback and the next trial is sudden.
     ***/
    await timer(FEEDBACK_DELAY_MS).toPromise()
    this.data.next();
    // This delay is for closing the feedback dialog component.
    await timer(FADE_OUT_DURATION_MS).toPromise()
    this.ref.close();
  }
}
