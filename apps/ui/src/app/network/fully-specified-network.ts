import { clone } from 'lodash-es';
import { CueTuple } from '../study-conditions/cue.constants';
import { StimuliComparisonTuple } from '../study-conditions/stimuli.interfaces';
import { StimulusCase } from '../study-conditions/stimulus-case';
import { getCombinatorialOperatorForBToC } from './cue-b-to-c-comparison';
import { Network } from './network';
import { MUTUALLY_ENTAILED_OPERATOR_DICT } from './opposite-operator-types';
import { StimuliComparison } from './stimuli-comparison';

export abstract class FullySpecifiedNetwork extends Network {

  protected constructor(
    num: number,
    stimulusCase: StimulusCase,
    operatorOptions: CueTuple<'SAME'|'GREATER THAN'|'LESS THAN'|'I CANNOT KNOW'>[]
  ) {
    super(num, stimulusCase, operatorOptions);
  }

  get combinatoriallyEntailed(): StimuliComparison[] {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [A, B, C] = this.stimuli;

    if (B === 'I CANNOT KNOW' || B === 'DIFFERENT' || C === 'I CANNOT KNOW' || C === 'DIFFERENT')
      throw Error(`Stimuli B and C were "${this.stimuli.join(' and ')}", they cannot be "I CANNOT KNOW OR DIFFERENT"`);

    const comparisonBToC = {
      cue: getCombinatorialOperatorForBToC(this.selectedCues),
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

  get mutuallyEntailed(): StimuliComparison[] {
    return this.trained.map(({ stimuli, cue }) => ({
      cue: MUTUALLY_ENTAILED_OPERATOR_DICT[cue],
      stimuli: clone(stimuli).reverse() as StimuliComparisonTuple
    }));
  }

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
