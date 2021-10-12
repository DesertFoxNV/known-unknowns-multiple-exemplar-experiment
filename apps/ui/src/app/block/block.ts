import { TrialType } from '../trial/trial.type';

export abstract class Block {
  name: string;

  protected constructor(name: string) {
    this.name = name;
  }

  abstract nextTrial(): TrialType|undefined
}
