import { CueNonArbitrary } from '../study-conditions/cue.constants';
import { StimulusCase } from '../study-conditions/stimulus-case';
import { Network } from './network';

export class FullySpecifiedNetwork extends Network {

  constructor(num: number, stimulusCase: StimulusCase) {
    super(num, stimulusCase, [
      [CueNonArbitrary.same, CueNonArbitrary.same],
      [CueNonArbitrary.same, CueNonArbitrary.greaterThan],
      [CueNonArbitrary.same, CueNonArbitrary.lessThan],
      [CueNonArbitrary.lessThan, CueNonArbitrary.same],
      [CueNonArbitrary.lessThan, CueNonArbitrary.greaterThan],
      [CueNonArbitrary.greaterThan, CueNonArbitrary.same],
      [CueNonArbitrary.greaterThan, CueNonArbitrary.lessThan]
    ]);
  }
}
