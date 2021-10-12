import { shuffle } from 'lodash-es';
import { Network } from '../network/network';
import { TrialType } from '../trial/trial.type';
import { Block } from './block';

export class PreTestBlock extends Block {
  completed?: Date;
  index = 0;
  network1: Network;
  network2: Network;
  started: Date|undefined;
  trials: TrialType[] = []; // 32 trials = (4 combinations x 2 networks) x 4 duplicates

  constructor(network1: Network, network2: Network) {
    super('Pre-Test');
    this.network1 = network1;
    this.network2 = network2;
    for (const network of [this.network1, this.network2]) {
      for (let i = 0; i < 4; i++) {
        this.trials.push(...network.mutuallyEntailed);
        this.trials.push(...network.combinatoriallyEntailed);
      }
    }
    this.trials = shuffle(this.trials);
  }

  nextTrial(): TrialType|undefined {
    if (this.index === 0) this.started = new Date();
    if (this.index > this.trials.length) this.completed = new Date;
    this.index++;
    return this.trials?.[this.index];
  }
}
