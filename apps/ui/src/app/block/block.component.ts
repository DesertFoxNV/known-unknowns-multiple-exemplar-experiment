import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, timer } from 'rxjs';
import { first, switchMap } from 'rxjs/operators';
import { StudyConditionService } from '../study-conditions/study-condition.service';
import { FADE_OUT_DURATION_MS } from '../trial/fade-out-duration';
import { Trial } from '../trial/trial';
import { FeedBackDialogData } from '../trial/trial-correct/feed-back-dialog.data';
import { FEEDBACK_DURATION_MS, FEEDBACK_FADE_OUT_DELAY_MS } from '../trial/trial-correct/feedback-duration';
import { TrialFeedbackDialogComponent } from '../trial/trial-correct/trial-feedback-dialog.component';
import { TrialComponent } from '../trial/trial.component';
import { BlockButtonDialogComponent, BlockButtonDialogData } from './block-button-dialog/block-button-dialog.component';
import { fullScreenDialogWithData } from './full-screen-dialog-with-data';
import { TRIAL_ANIMATION_DURATION_MS } from './trial-animation-delay';

@Component({
  selector: 'block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.scss'],
  animations: []
})
export class BlockComponent {
  @Output() completed = new EventEmitter();
  conditions = this.conditionSvc.conditions;
  isVisible = true;
  @Output() trialCompleted = new EventEmitter();
  @ViewChild(TrialComponent, { static: false }) trialComponent?: TrialComponent;

  constructor(
    readonly conditionSvc: StudyConditionService,
    private dialog: MatDialog
  ) {
  }

  /**
   * Shows a clickable dialog to the user with a prompt.
   * @param {string} text
   * @param {boolean} disableClose
   * @param {number} delayMs
   * @returns {Observable<void>}
   */
  prompt(text: string, disableClose = false, delayMs = TRIAL_ANIMATION_DURATION_MS): Observable<void> {
    return timer(delayMs).pipe(
      first(),
      switchMap(() => this.dialog.open(
        BlockButtonDialogComponent,
        fullScreenDialogWithData<BlockButtonDialogData>({ text, disableClose })
      ).afterClosed())
    );
  }

  /**
   * Removes trial component from the component to hide cues from user.
   * @param {boolean} isVisible
   * @param {number} delayMs
   */
  setVisibility(isVisible: boolean, delayMs = TRIAL_ANIMATION_DURATION_MS) {
    setTimeout(() => this.isVisible = isVisible, delayMs);
  }

  /**
   * Shows feedback to a participant for a set duration.
   * @param {string} feedback
   * @param {number} durationMs
   * @param {{duration: number, delay: number}} animationParams
   */
  showFeedback(
    feedback: string,
    durationMs = FEEDBACK_DURATION_MS,
    animationParams = { delay: FEEDBACK_FADE_OUT_DELAY_MS, duration: FADE_OUT_DURATION_MS }
  ) {
    this.dialog.open(
      TrialFeedbackDialogComponent,
      fullScreenDialogWithData<FeedBackDialogData>({ animationParams, durationMs, feedback })
    );
  }

  /**
   * Shows the next trial
   * @param {Trial} trial
   * @param {number} delayMs
   */
  showTrial(trial: Trial, delayMs = FEEDBACK_FADE_OUT_DELAY_MS) {
    setTimeout(() => this.trialComponent?.show(trial), delayMs);
  }
}
