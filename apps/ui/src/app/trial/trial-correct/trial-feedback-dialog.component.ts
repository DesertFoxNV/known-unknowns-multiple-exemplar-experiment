import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {fadeOut} from '../../animations/fade-out.animation';
import {FADE_OUT_DURATION_MS} from '../../trial/fade-out-duration';
import {FeedBackDialogData} from "./feed-back-dialog.data";
import {delay as Delay} from 'utils-decorators';

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
export class TrialFeedbackDialogComponent {
  animated = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: FeedBackDialogData,
    readonly ref: MatDialogRef<TrialFeedbackDialogComponent>
  ) {
    this.animate()
    this.next()
    this.close()
  }

  // This delay prevents a change detection error
  @Delay(0)
  animate() {
    this.animated = true
  }

  /***
   * This delay allows the next trial fadeOut animation to be started before the dialog fadeOut finishes.
   * Without this delay, the old trial cues are shown again before fading out.
   */
  @Delay(FEEDBACK_DELAY_MS)
  next() {
    this.data.next();
  }

  // This delay allows the feedback fadeOut animation to finish before closing the dialog component.
  @Delay(FEEDBACK_TIME_MS)
  close() {
    this.ref.close()
  }
}
