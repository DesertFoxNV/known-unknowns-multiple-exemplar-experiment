import { clone } from 'lodash-es';
import { CUE_NON_ARBITRARY } from '../study-conditions/cue.constants';
import { StimuliComparisonTuple } from '../study-conditions/stimuli.interfaces';
import { StimulusCase } from '../study-conditions/stimulus-case';
import { Network } from './network';
import { StimuliComparison } from './stimuli-comparison';

export class BinaryNetwork extends Network {

  /**
   * Creates a same/different network. Aka A = A, A != B, A!=C, B = B, B != C, C = C and the reverse comparisons.
   * @param {number} num specifies the number of the network. For example, num 1 would be Network 1.
   * @param {StimulusCase} stimulusCase specifies the trigram case of the network. Upper or lowercase.
   */
  constructor(num: number, stimulusCase: StimulusCase) {
    super(num, stimulusCase, [
      [CUE_NON_ARBITRARY.different, CUE_NON_ARBITRARY.different]
    ]);
  }

  /**
   * Generates the combinatorially entailed stimulus comparisons B to C and C to B.
   * @returns {StimuliComparison[]}
   */
  get combinatoriallyEntailed(): StimuliComparison[] {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [A, B, C] = this.stimuli;

    const comparisonBToC = {
      cue: CUE_NON_ARBITRARY.different,
      stimuli: [B, C] as StimuliComparisonTuple
    };
    return [
      comparisonBToC,
      {
        cue: CUE_NON_ARBITRARY.different,
        stimuli: clone(comparisonBToC.stimuli).reverse() as StimuliComparisonTuple
      }
    ];
  }

  /**
   * Generates the combinatorially entailed stimulus comparisons B to A and C to A.
   * @returns {StimuliComparison[]}
   */
  get mutuallyEntailed(): StimuliComparison[] {
    return this.trained.map(({ stimuli, cue }) => ({
      cue: CUE_NON_ARBITRARY.different,
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
      `MutuallyEntailed ${this.comparisonToString(this.mutuallyEntailed)}`,
      `CombinatoriallyEntailed ${this.comparisonToString(this.combinatoriallyEntailed)}`
    ].join('\n');
  }
}
