import { StudyConfig } from '../study-config-form/study-config';
import { Trial } from '../trial/trial';

export abstract class Block {
  completed?: Date;
  index = 0;
  name: string;
  started: Date|undefined;
  trials: Trial[] = [];
  showFeedback = false;

  protected constructor(name: string) {
    this.name = name;
  }

  abstract createTrials(config: StudyConfig): void

  nextTrial(): Trial|undefined {
    if (this.index === 0) this.started = new Date();
    if (this.index > this.trials.length) this.completed = new Date;
    this.index++;
    return this.trials?.[this.index - 1];
  }
}
