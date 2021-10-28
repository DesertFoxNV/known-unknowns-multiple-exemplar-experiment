import { StudyConfig } from '../study-config-form/study-config';
import { CueSelected } from '../trial/cue-selected';
import { CompletedTrial, Trial } from '../trial/trial';
import { BlockComponent } from './block.component';

export abstract class Block {
  completed?: Date;
  component?: BlockComponent;
  config: StudyConfig;
  correctCount = 0;
  history: CompletedTrial[] = [];
  index = -1;
  name: string;
  started: Date|undefined;
  trials: Trial[] = [];

  protected constructor(name: string, config: StudyConfig) {
    this.name = name;
    this.config = config;
  }

  get trial(): Trial {
    return this.trials[this.index];
  }

  complete() {
    this.completed = new Date();
    this.component?.showMessage('BLOCK COMPLETE', true);
    this.component?.completed.emit();
  }

  abstract createTrials(): void

  cueSelected(selected: CueSelected|undefined) {
    this.history.push({ ...this.trial, selected });

    const isCorrect = selected?.cue.value === this.trial.cue;
    if (isCorrect) this.correctCount++;
    console.log('correct', this.correctCount);
    console.log('incorrect', this.index + 1 - this.correctCount);

    // This prevents the user from seeing the last trial again.
    if (this.index === this.trials.length - 1) setTimeout(() => this.component?.setVisibility(false), 2000);

    if (!selected) {
      this.component?.showFeedback('TIME EXPIRED');
    } else if (this.feedbackEnabled()) {
      this.component?.showFeedback(isCorrect ? 'CORRECT' : 'WRONG');
    } else {
      this.nextTrial();
    }

  }

  feedbackEnabled() {
    return false;
  }

  nextTrial() {
    if (this.index === 0) this.started = new Date();
    if (this.index !== this.trials.length - 1) {
      this.index++;
      this.component?.showTrial(this.trial);
    } else {
      // This creates some space between showing the feedback and the block results
      setTimeout(() => this.complete(), 1000);
    }
  }

  /***
   * Resets index to -1, correctCount to 0, and generates fresh trials.
   */
  reset() {
    this.index = -1;
    this.correctCount = 0;
    this.createTrials();
  }

  start(component: BlockComponent) {
    this.component = component;
    this.createTrials();
    component.showMessage('CLICK TO START');
  }
}
