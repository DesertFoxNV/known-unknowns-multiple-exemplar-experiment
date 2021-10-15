import { clone } from 'lodash-es';
import { CUE_NON_ARBITRARY } from '../study-conditions/cue.constants';
import { StimuliComparisonTuple } from '../study-conditions/stimuli.interfaces';
import { StimulusCase } from '../study-conditions/stimulus-case';
import { Network } from './network';
import { StimuliComparison } from './stimuli-comparison';

export class BinaryNetwork extends Network {

  constructor(num: number, stimulusCase: StimulusCase) {
    super(num, stimulusCase, [
      [CUE_NON_ARBITRARY.different, CUE_NON_ARBITRARY.different]
    ]);
  }

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

  get mutuallyEntailed(): StimuliComparison[] {
    return this.trained.map(({ stimuli, cue }) => ({
      cue: CUE_NON_ARBITRARY.different,
      stimuli: clone(stimuli).reverse() as StimuliComparisonTuple
    }));
  }

  toString(): string {
    return [
      `Network ${this.num}`,
      this.stimuli.map((stimulus, i) => `${String.fromCharCode(65 + i)}${this.num} = ${this.stimuli[i]}`).join(', '),
      `Identities: ${this.comparisonToString(this.identities)}`,
      `Trained: ${this.comparisonToString(this.trained)}`
    ].join('\n');
  }
}
