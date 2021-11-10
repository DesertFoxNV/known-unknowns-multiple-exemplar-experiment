import { first } from 'rxjs/operators';
import { StudyConfig, StudyConfigWCase } from '../study-config-form/study-config';
import { CueSelected } from '../trial/cue-selected';
import { FADE_OUT_DURATION_MS } from '../trial/fade-out-duration';
import { CompletedTrial, Trial } from '../trial/trial';
import { FEEDBACK_FADE_OUT_DELAY_MS } from '../trial/trial-correct/feedback-duration';
import { BlockComponent } from './block.component';
import { TRIAL_DELAY_INTERVAL_MS } from './trial-animation-delay';

export abstract class Block {
  attempts = 0;
  completed?: Date;
  component?: BlockComponent;
  config: StudyConfigWCase;
  correct = 0;
  feedBackShown = false;
  history: CompletedTrial[] = [];
  incorrect = 0;
  index = -1;
  name: string;
  started: Date|undefined;
  trials: Trial[] = [];

  /**
   *
   * @param {string} name
   * @param {StudyConfig} config
   * @protected
   */
  protected constructor(name: string, config: StudyConfigWCase) {
    this.name = name;
    this.config = config;
  }

  /**
   * Returns true if it is the last trial and false if is is not.
   * @returns {boolean}
   */
  get isLastTrial(): boolean {
    return this.index === this.trials.length - 1;
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
    this.component?.setVisibility(false);
    this.completed = new Date();
    this.component?.prompt(
      'BLOCK COMPLETE',
      true,
      TRIAL_DELAY_INTERVAL_MS + (this.feedBackShown ? FEEDBACK_FADE_OUT_DELAY_MS : FADE_OUT_DURATION_MS)).subscribe();
    this.component?.completed.emit();
  }

  /**
   * Creates trials for the block
   */
  abstract createTrials(): Trial[]

  /**
   * When a relation is selected. The associated trial and relation selected data
   * is stored. Feedback is shown if an item is not selected or feedback
   * is enabled. Then the block is advanced to the next trial.
   * @param {CueSelected | undefined} selected
   */
  cueSelected(selected: CueSelected|undefined) {
    this.history.push({ ...this.trial, selected });

    // This prevents the user from seeing the last trial again, due to fadeout animation.
    if (this.isLastTrial) this.component?.setVisibility(false);

    const feedback = this.grade(selected);

    if (!selected) {
      this.component?.showFeedback('TIME EXPIRED');
      this.feedBackShown = true;
    } else if (feedback && this.feedbackEnabled()) {
      this.component?.showFeedback(feedback);
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
    this.component?.setVisibility(false);
    this.component?.prompt('THANKS FOR PARTICIPATING', true, TRIAL_DELAY_INTERVAL_MS +
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
    } else {
      this.incorrect++;
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
    if (this.index === -1) this.started = new Date();

    if (this.index !== this.trials.length - 1) {
      this.index++;
      this.component?.showTrial(this.trial, this.feedBackShown ? FEEDBACK_FADE_OUT_DELAY_MS : 0);
      this.component?.trialCompleted.pipe(first()).subscribe(selected => this.cueSelected(selected));
    } else {
      this.complete();
    }
  }

  /***
   * Resets block index, correct count, incorrect count, and generates fresh trials.
   */
  reset() {
    this.index = -1;
    this.correct = 0;
    this.incorrect = 0;
    this.trials = this.createTrials();
  }

  /***
   * Resets block index, binds to the view, and shows a message.
   * @param {BlockComponent} component
   */
  start(component: BlockComponent) {
    this.component = component;
    if (this.trials.length === 0) this.reset();
    component.prompt('CLICK TO START', false, TRIAL_DELAY_INTERVAL_MS)
      .subscribe(() => this.nextTrial());
  }
}
