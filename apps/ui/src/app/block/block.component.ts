import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, timer } from 'rxjs';
import { first, switchMap } from 'rxjs/operators';
import { StudyConfig } from '../study-config-form/study-config';
import { CueSelected } from '../trial/cue-selected';
import { FADE_OUT_DURATION_MS } from '../trial/fade-out-duration';
import { CompletedTrial, Trial } from '../trial/trial';
import { FeedBackDialogData } from '../trial/trial-correct/feed-back-dialog.data';
import { FEEDBACK_DURATION_MS, FEEDBACK_FADE_OUT_DELAY_MS } from '../trial/trial-correct/feedback-duration';
import { TrialFeedbackDialogComponent } from '../trial/trial-correct/trial-feedback-dialog.component';
import { TrialComponent } from '../trial/trial.component';
import { BlockButtonDialogComponent, BlockButtonDialogData } from './block-button-dialog/block-button-dialog.component';
import { fullScreenDialogWithData } from './full-screen-dialog-with-data';
import { TRIAL_ANIMATION_DURATION_MS, TRIAL_DELAY_INTERVAL_MS } from './trial-animation-delay';

@Component({
  selector: 'block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.scss'],
  animations: []
})
export class BlockComponent {
  attempts = 0;
  @Output() completed = new EventEmitter();
  @Input() studyConfig?: StudyConfig;
  completedAt?: Date;
  correct = 0;
  feedBackShown = false;
  history: CompletedTrial[] = [];
  incorrect = 0;
  index = -1;
  isVisible = true;
  name = 'Block';
  sequentialCorrect = 0;
  startedAt: Date|undefined;
  @Output() trialCompleted = new EventEmitter();
  @ViewChild(TrialComponent, { static: false }) trialComponent?: TrialComponent;
  trials: Trial[] = [];

  constructor(
    private dialog: MatDialog
  ) {
  }

  /**
   * Calculates the percent correct in the current trial attempt by
   * dividing the correct count by the trial number and multiplying by 100
   * @returns {number}
   */
  get percentCorrect(): number {
    return (this.correct / (this.correct + this.incorrect)) * 100;
  }

  /**
   * Returns the current trial based on the current index.
   * @returns {Trial}
   */
  get trial(): Trial {
    return this.trials[this.index];
  }

  /**
   * Converts index (zero-based) to trial number
   * @returns {number}
   */
  get trialNum() {
    return this.index + 1;
  }

  /**
   * Increases the number of attempts, sets the completed at date, then emits the completed event.
   */
  complete() {
    this.attempts++;
    this.setVisibility(false, TRIAL_DELAY_INTERVAL_MS);
    this.completedAt = new Date();
    setTimeout(() => {
      this.completed.emit();
    }, TRIAL_DELAY_INTERVAL_MS + (this.feedBackShown ? FEEDBACK_FADE_OUT_DELAY_MS : FADE_OUT_DURATION_MS));
  }

  /**
   * Creates trials for the block
   */
  createTrials(): Trial[] {
    return [];
  }

  /**
   * When a relation is selected. The associated trial and relation selected data
   * is stored. Feedback is shown if an item is not selected or feedback
   * is enabled. Then the block is advanced to the next trial.
   * @param {CueSelected | undefined} selected
   */
  cueSelected(selected: CueSelected|undefined) {
    this.history.push({ ...this.trial, selected });

    const feedback = this.grade(selected);

    if (!selected) {
      this.showFeedback('TIME EXPIRED');
      this.feedBackShown = true;
    } else if (feedback && this.feedbackEnabled()) {
      this.showFeedback(feedback);
      this.feedBackShown = true;
    } else {
      this.feedBackShown = false;
    }

    /**
     * If feedback is not enabled but the "TIME EXPIRED" feedback is shown a
     * delay must be added so that the participant will see the trial stimuli
     * and relation animations.
     */
    this.nextTrial();

  }

  /**
   * Participants that fail the block criterion are thanked for their participation and the study is completed.
   */
  failed() {
    this.setVisibility(false);
    this.prompt('THANKS FOR PARTICIPATING', true, TRIAL_DELAY_INTERVAL_MS +
      (this.feedBackShown ? FEEDBACK_FADE_OUT_DELAY_MS : FADE_OUT_DURATION_MS)).subscribe();
  }

  /**
   * Function that determines if feedback is enabled. This can easily be overridden
   * in block subclasses to accommodate complex feedback scenarios. Reference
   * the forced choice block.
   * @returns {boolean}
   */
  feedbackEnabled() {
    return false;
  }

  /**
   * The selected relation is compared to the the trial relation. If the selected relation is
   * correct the correct counter is increased by 1 otherwise, the incorrect counter
   * is increased by one. If the answer was correct the feedback string "CORRECT"
   * is returned otherwise the feedback string "WRONG" is returned.
   * @param {CueSelected | undefined} selected
   * @returns {"CORRECT" | "WRONG"}
   */
  grade(selected: CueSelected|undefined): 'CORRECT'|'WRONG'|null {
    const isCorrect = selected?.cue.value === this.trial.relation;

    if (selected?.cue.value === this.trial.relation) {
      this.correct++;
      this.sequentialCorrect++;
    } else {
      this.incorrect++;
      this.sequentialCorrect = 0;
    }
    console.log('correct', this.correct);
    console.log('incorrect', this.incorrect);
    console.log('correctPercentage', this.percentCorrect);

    return isCorrect ? 'CORRECT' : 'WRONG';
  }

  /**
   * Starts the next trial in the block. If the index is negative then the
   * started date is stored. If the trials have not been completed the index is
   * increased by 1 and then the trial is shown with the specified delay. The
   * trial completed event is subscribe to and linked to the relation selected function
   * in the block. If all trials have been completed the complete function is called.
   */
  nextTrial() {
    if (this.index === -1) this.startedAt = new Date();

    if (this.index !== this.trials.length - 1) {
      this.index++;
      this.showTrial(this.trial, this.feedBackShown ? FEEDBACK_FADE_OUT_DELAY_MS : 0);
      this.trialCompleted.pipe(first()).subscribe(selected => this.cueSelected(selected));
    } else {
      this.complete();
    }
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

  /***
   * Resets block index, correct count, incorrect count, and generates fresh trials.
   */
  reset() {
    this.index = -1;
    this.correct = 0;
    this.incorrect = 0;
    this.sequentialCorrect = 0;
    this.trials = this.createTrials();
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
    feedback: FeedBackDialogData['feedback'],
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

  /***
   * Resets block index, binds to the view, and shows a message.
   * @param {BlockComponent} component
   */
  start() {
    if (this.trials.length === 0) this.reset();
    this.prompt('CLICK TO START', false, TRIAL_DELAY_INTERVAL_MS)
      .subscribe(() => {
        this.setVisibility(true, 0);
        this.nextTrial();
      });
  }
}
