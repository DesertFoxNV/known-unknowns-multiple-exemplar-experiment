import { CUE_NON_ARBITRARY } from '../study-conditions/cue.constants';
import { StimulusCase } from '../study-conditions/stimulus-case';
import { FullySpecifiedNetwork } from './fully-specified-network';

export class KnownGreaterThanNetwork extends FullySpecifiedNetwork {

  /**
   * Creates a fully specified greater than network A > B and A > C.
   * @param {number} num specifies the number of the network. For example, num 1 would be Network 1.
   * @param {StimulusCase} stimulusCase specifies the trigram case of the network. Upper or lowercase.
   */
  constructor(
    num: number,
    stimulusCase: StimulusCase
  ) {
    super(num, stimulusCase, [[CUE_NON_ARBITRARY.greaterThan, CUE_NON_ARBITRARY.greaterThan]]);
  }
}
