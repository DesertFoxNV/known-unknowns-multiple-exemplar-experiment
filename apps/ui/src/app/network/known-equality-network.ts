import { CUE_NON_ARBITRARY } from '../study-conditions/cue.constants';
import { StimulusCase } from '../study-conditions/stimulus-case';
import { KnownNetwork } from './known-network';

export class KnownEqualityNetwork extends KnownNetwork {

  /**
   * Creates a fully specified equality network A = B = C.
   * @param {number} num specifies the number of the network. For example, num 1 would be Network 1.
   * @param {StimulusCase} stimulusCase specifies the trigram case of the network. Upper or lowercase.
   */
  constructor(
    num: number,
    stimulusCase: StimulusCase
  ) {
    super(num, stimulusCase, [[CUE_NON_ARBITRARY.same, CUE_NON_ARBITRARY.same]]);
  }
}
