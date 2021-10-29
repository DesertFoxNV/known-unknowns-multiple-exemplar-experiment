import { first } from 'rxjs/operators';
import { StudyConfig } from '../study-config-form/study-config';
import { CueSelected } from '../trial/cue-selected';
import { CompletedTrial, Trial } from '../trial/trial';
import { BlockComponent } from './block.component';

export abstract class Block {
  completed?: Date;
  component?: BlockComponent;
  config: StudyConfig;
  correct = 0;
  history: CompletedTrial[] = [];
  incorrect = 0;
  index = -1;
  name: string;
  started: Date|undefined;
  trials: Trial[] = [];

  protected constructor(name: string, config: StudyConfig) {
    this.name = name;
    this.config = config;
  }

  get isLastTrial(): boolean {
    return this.index === this.trials.length - 1;
  }

  get percentCorrect(): number {
    return this.correct / (this.index + 1) * 100;
  }

  get trial(): Trial {
    return this.trials[this.index];
  }

  complete() {
    this.completed = new Date();
    this.component?.prompt('BLOCK COMPLETE', true).subscribe();
    this.component?.completed.emit();
  }

  abstract createTrials(): void

  cueSelected(selected: CueSelected|undefined) {
    this.history.push({ ...this.trial, selected });

    // This prevents the user from seeing the last trial again, due to fadeout animation.
    if (this.isLastTrial) this.component?.setVisibility(false);

    if (!selected) {
      this.component?.showFeedback('TIME EXPIRED');
    } else if (this.feedbackEnabled()) {
      this.component?.showFeedback(this.grade(selected));
    }

    this.nextTrial();
  }

  feedbackEnabled() {
    return false;
  }

  grade(selected: CueSelected|undefined): 'CORRECT'|'WRONG' {
    const isCorrect = selected?.cue.value === this.trial.cue;

    if (selected?.cue.value === this.trial.cue) {
      this.correct++;
    } else {
      this.incorrect++;
    }
    console.log('correct', this.correct);
    console.log('incorrect', this.incorrect);
    console.log('correctPercentage', this.percentCorrect);

    return isCorrect ? 'CORRECT' : 'WRONG';
  }

  nextTrial(delayMs?: number) {
    // On the first trial store a date
    if (this.index === -1) this.started = new Date();

    // If all trails have not been completed move to the next trial,
    // otherwise call complete on the block.
    if (this.index !== this.trials.length - 1) {
      this.index++;
      this.component?.showTrial(this.trial, delayMs);
      this.component?.trialCompleted.pipe(first()).subscribe(selected => this.cueSelected(selected));
    } else {
      this.complete();
    }
  }

  /***
   * Resets block index and grades.
   */
  reset() {
    this.index = -1;
    this.correct = 0;
    this.incorrect = 0;
    this.createTrials();
  }

  /***
   * Resets block index, binds to the view, and shows a message.
   * @param {BlockComponent} component
   */
  start(component: BlockComponent) {
    this.component = component;
    this.reset();
    component.prompt('CLICK TO START').subscribe(() => this.nextTrial(0));
  }
}
