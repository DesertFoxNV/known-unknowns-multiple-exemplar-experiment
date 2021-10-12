import { CueNonArbitrary } from '../study-conditions/cue.constants';
import { StimulusCase } from '../study-conditions/stimulus-case';
import { Network } from './network';

export class KnownUnknownNetwork extends Network {

  constructor(num: number, stimulusCase: StimulusCase) {
    super(num, stimulusCase, [
      [CueNonArbitrary.lessThan, CueNonArbitrary.lessThan],
      [CueNonArbitrary.greaterThan, CueNonArbitrary.greaterThan]
    ]);
  }
}
