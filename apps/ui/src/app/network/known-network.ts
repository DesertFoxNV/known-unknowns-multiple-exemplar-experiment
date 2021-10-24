import { CUE_NON_ARBITRARY } from '../study-conditions/cue.constants';
import { StimulusCase } from '../study-conditions/stimulus-case';
import { FullySpecifiedNetwork } from './fully-specified-network';

export class KnownNetwork extends FullySpecifiedNetwork {

  constructor(num: number, stimulusCase: StimulusCase) {
    super(num, stimulusCase, [
      [CUE_NON_ARBITRARY.same, CUE_NON_ARBITRARY.same],
      [CUE_NON_ARBITRARY.same, CUE_NON_ARBITRARY.greaterThan],
      [CUE_NON_ARBITRARY.same, CUE_NON_ARBITRARY.lessThan],
      [CUE_NON_ARBITRARY.lessThan, CUE_NON_ARBITRARY.same],
      [CUE_NON_ARBITRARY.lessThan, CUE_NON_ARBITRARY.greaterThan],
      [CUE_NON_ARBITRARY.greaterThan, CUE_NON_ARBITRARY.same],
      [CUE_NON_ARBITRARY.greaterThan, CUE_NON_ARBITRARY.lessThan]
    ]);
  }
}