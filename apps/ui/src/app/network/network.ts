import { clone, sample } from 'lodash-es';
import { CUE_NON_ARBITRARY, CueNonArbitrary, CueTuple } from '../study-conditions/cue.constants';
import { getRandomStimuli } from '../study-conditions/get-random-stimuli';
import { StimuliComparisonTuple, StimuliNetworkTuple } from '../study-conditions/stimuli.interfaces';
import { StimulusCase } from '../study-conditions/stimulus-case';
import { getBToCComparisonCue } from './cue-b-to-c-comparison';
import { OPPOSITE_OPERATOR_TYPES } from './opposite-operator-types';
import { StimuliComparison } from './stimuli-comparison';

export abstract class Network {

  case: StimulusCase;
  num: number;
  selectedCues: CueTuple;
  stimuli: StimuliNetworkTuple;

  protected constructor(
    num: number,
    stimulusCase: StimulusCase,
    operatorOptions: CueTuple[]
  ) {
    this.num = num;
    this.case = stimulusCase;
    this.stimuli = getRandomStimuli(3, stimulusCase) as StimuliNetworkTuple;
    this.selectedCues = sample(operatorOptions) as CueTuple;
  }

  get combinatoriallyEntailed(): StimuliComparison[] {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [A, B, C] = this.stimuli;
    const comparisonBToC = {
      cue: getBToCComparisonCue(this.selectedCues) as CueNonArbitrary,
      stimuli: [B, C] as StimuliComparisonTuple
    };
    return [
      comparisonBToC,
      {
        cue: OPPOSITE_OPERATOR_TYPES[comparisonBToC.cue],
        stimuli: clone(comparisonBToC.stimuli).reverse() as StimuliComparisonTuple
      }
    ];
  }

  get identities(): StimuliComparison[] {
    return this.stimuli.map(stimulus => {
      return {
        cue: CUE_NON_ARBITRARY.same,
        stimuli: [stimulus, stimulus]
      };
    });
  }

  get mutuallyEntailed(): StimuliComparison[] {
    return this.trained.map(({ stimuli, cue }) => ({
      cue: OPPOSITE_OPERATOR_TYPES[cue],
      stimuli: clone(stimuli).reverse() as StimuliComparisonTuple
    }));
  }

  get trained(): StimuliComparison[] {
    const [A, B, C] = this.stimuli;
    return [
      {
        cue: this.selectedCues[0],
        stimuli: [A, B]
      },
      {
        cue: this.selectedCues[1],
        stimuli: [A, C]
      }
    ];
  }

  comparisonToString(comparison: StimuliComparison[]): string {
    return comparison.map(
      ({ cue, stimuli: [stimulus1, stimulus2] }) => `${stimulus1} ${cue} ${stimulus2}`).join(', ');
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

