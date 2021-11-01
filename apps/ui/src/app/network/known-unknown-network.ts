import { clone } from 'lodash-es';
import { StimuliComparisonTuple } from '../study-conditions/stimuli.interfaces';
import { StimulusCase } from '../study-conditions/stimulus-case';
import { getCombinatorialOperatorForBToCCToBKnown } from './combinatorially-entailed-operator-dictionary';
import { FullySpecifiedNetwork } from './fully-specified-network';
import { MUTUALLY_ENTAILED_OPERATOR_DICT } from './mutually-entailed-operator-dictionary';
import { StimuliComparison } from './stimuli-comparison';
import { UNKNOWN_NETWORK_CUE_OPERATORS, UnknownNetworkAToBAToCOperators } from './unknown-network-cue-operators';

export class KnownUnknownNetwork extends FullySpecifiedNetwork {

  /**
   * Creates a fully specified unknown network.
   * @param {number} num specifies the number of the network. For example, num 1 would be Network 1.
   * @param {StimulusCase} stimulusCase specifies the trigram case of the network. Upper or lowercase.
   * @param {UnknownNetworkAToBAToCOperators[]} aToBAToCOperatorOptions specifies the available A to B and A to C operators that can be randomly selected.
   */
  constructor(
    num: number,
    stimulusCase: StimulusCase,
    aToBAToCOperatorOptions: UnknownNetworkAToBAToCOperators[] = UNKNOWN_NETWORK_CUE_OPERATORS
  ) {
    super(num, stimulusCase, aToBAToCOperatorOptions);
  }

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

  /**
   * Generates a string that shows the network number, and stimulus comparisons
   * @returns {string}
   */
  toString(): string {
    return [
      `Network ${this.num}`,
      this.stimuli.map((stimulus, i) => `${String.fromCharCode(65 + i)}${this.num} = ${this.stimuli[i]}`).join(', '),
      `Identities: ${this.comparisonToString(this.identities)}`,
      `Trained: ${this.comparisonToString(this.trained)}`,
      `Mutually Entailed: ${this.comparisonToString(this.mutuallyEntailed)}`,
      `Combinatorially Entailed: ${this.comparisonToString(this.combinatoriallyEntailed)}`
    ].join('\n');
  }
}
