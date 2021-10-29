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

  prompt(text: string, disableClose = false, delayMs = FEEDBACK_FADE_OUT_DELAY_MS / 2): Observable<void> {
    return timer(delayMs).pipe(
      first(),
      switchMap(() => this.dialog.open(
        BlockButtonDialogComponent,
        fullScreenDialogWithData<BlockButtonDialogData>({ text, disableClose })
      ).afterClosed())
    );
  }

  setVisibility(isVisible: boolean, delayMs = FEEDBACK_FADE_OUT_DELAY_MS / 2) {
    setTimeout(() => this.isVisible = isVisible, delayMs);
  }

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

  showTrial(trial: Trial, delayMs = FEEDBACK_FADE_OUT_DELAY_MS) {
    setTimeout(() => this.trialComponent?.show(trial), delayMs);
  }
}
