import { StimulusCase } from '../study-conditions/stimulus-case';
import { FullySpecifiedNetwork } from './fully-specified-network';
import { KNOWN_NETWORK_CUE_OPERATORS, KnownNetworkAToBAToCOperators } from './known-network-cue-operators';

export class KnownNetwork extends FullySpecifiedNetwork {

  /**
   * Creates a fully specified known network.
   * @param {number} num specifies the number of the network. For example, num 1 would be Network 1.
   * @param {StimulusCase} stimulusCase specifies the trigram case of the network. Upper or lowercase.
   * @param {KnownNetworkAToBAToCOperators[]} aToBAToCOperatorOptions specifies the available A to B and A to C operators that can be randomly selected.
   */
  constructor(
    num: number,
    stimulusCase: StimulusCase,
    aToBAToCOperatorOptions: KnownNetworkAToBAToCOperators[] = KNOWN_NETWORK_CUE_OPERATORS
  ) {
    super(num, stimulusCase, aToBAToCOperatorOptions);
  }
}
