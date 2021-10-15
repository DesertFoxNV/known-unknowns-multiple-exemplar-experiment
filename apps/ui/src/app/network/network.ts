import { sample } from 'lodash-es';
import { CUE_NON_ARBITRARY, CueNonArbitrary, CueTuple } from '../study-conditions/cue.constants';
import { getRandomStimuli } from '../study-conditions/get-random-stimuli';
import { StimuliNetworkTuple } from '../study-conditions/stimuli.interfaces';
import { StimulusCase } from '../study-conditions/stimulus-case';
import { StimuliComparison } from './stimuli-comparison';

export abstract class Network {

  case: StimulusCase;
  num: number;
  selectedCues: CueTuple<CueNonArbitrary>;
  stimuli: StimuliNetworkTuple;

  protected constructor(
    num: number,
    stimulusCase: StimulusCase,
    operatorOptions: CueTuple<CueNonArbitrary>[]
  ) {
    this.num = num;
    this.case = stimulusCase;
    this.stimuli = getRandomStimuli(3, stimulusCase) as StimuliNetworkTuple;
    this.selectedCues = sample(operatorOptions) as CueTuple<CueNonArbitrary>;
  }

  get identities(): StimuliComparison[] {
    return this.stimuli.map(stimulus => {
      return {
        cue: CUE_NON_ARBITRARY.same,
        stimuli: [stimulus, stimulus]
      };
    });
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

  abstract toString(): string
}

