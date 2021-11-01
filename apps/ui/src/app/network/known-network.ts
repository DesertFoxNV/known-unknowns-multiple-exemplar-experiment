import { clone } from 'lodash-es';
import { StimuliComparisonTuple } from '../study-conditions/stimuli.interfaces';
import { StimulusCase } from '../study-conditions/stimulus-case';
import { getCombinatorialOperatorForBToCCToBKnown } from './combinatorially-entailed-operator-dictionary';
import { FullySpecifiedNetwork } from './fully-specified-network';
import { KNOWN_NETWORK_CUE_OPERATORS, KnownNetworkAToBAToCOperators } from './known-network-cue-operators';
import { MUTUALLY_ENTAILED_OPERATOR_DICT } from './mutually-entailed-operator-dictionary';
import { StimuliComparison } from './stimuli-comparison';

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

  // TODO: technically this may or may not have combinatorially entailed stimulus if B to C or C to B is specified.
  /**
   * Generates the combinatorially entailed stimulus comparisons B to C and C to B.
   * @returns {StimuliComparison[]}
   */
  get combinatoriallyEntailed(): StimuliComparison[] {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [A, B, C] = this.stimuli;

    if (B === 'I CANNOT KNOW' || B === 'DIFFERENT' || C === 'I CANNOT KNOW' || C === 'DIFFERENT')
      throw Error(`Stimuli B and C were "${this.stimuli.join(' and ')}", they cannot be "I CANNOT KNOW OR DIFFERENT"`);

    const comparisonBToC = {
      cue: getCombinatorialOperatorForBToCCToBKnown(this.selectedAtoBAToCOperators),
      stimuli: [B, C] as StimuliComparisonTuple
    };
    return [
      comparisonBToC,
      {
        cue: MUTUALLY_ENTAILED_OPERATOR_DICT[comparisonBToC.cue],
        stimuli: clone(comparisonBToC.stimuli).reverse() as StimuliComparisonTuple
      }
    ];
  }
}
