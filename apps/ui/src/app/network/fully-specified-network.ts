import { clone } from 'lodash-es';
import { CueTuple } from '../study-conditions/cue.constants';
import { StimuliComparisonTuple } from '../study-conditions/stimuli.interfaces';
import { StimulusCase } from '../study-conditions/stimulus-case';
import { MUTUALLY_ENTAILED_OPERATOR_DICT } from './mutually-entailed-operator-dictionary';
import { Network } from './network';
import { StimuliComparison } from './stimuli-comparison';

export abstract class FullySpecifiedNetwork extends Network {

  /**
   * Creates a fully specified network.
   * @param {number} num specifies the number of the network. For example, num 1 would be Network 1.
   * @param {StimulusCase} stimulusCase specifies the trigram case of the network. Upper or lowercase.
   * @param {CueTuple<'SAME'|'GREATER THAN'|'LESS THAN'|'I CANNOT KNOW'>[]} aToBAToCOperatorOptions specifies the available A to B and A to C operators that can be randomly selected.
   */
  protected constructor(
    num: number,
    stimulusCase: StimulusCase,
    aToBAToCOperatorOptions: CueTuple<'SAME'|'GREATER THAN'|'LESS THAN'|'I CANNOT KNOW'>[]
  ) {
    super(num, stimulusCase, aToBAToCOperatorOptions);
  }

  /**
   * Generates the combinatorially entailed stimulus comparisons B to C and C to B.
   * @returns {StimuliComparison[]}
   */
  abstract get combinatoriallyEntailed(): StimuliComparison[]

  /**
   * Generates the combinatorially entailed stimulus comparisons B to A and C to A.
   * @returns {StimuliComparison[]}
   */
  get mutuallyEntailed(): StimuliComparison[] {
    return this.trained.map(({ stimuli, relation }) => ({
      relation: MUTUALLY_ENTAILED_OPERATOR_DICT[relation],
      stimuli: clone(stimuli).reverse() as StimuliComparisonTuple
    }));
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
