import { sample } from 'lodash-es';
import { CUE_NON_ARBITRARY, CueNonArbitrary, CueTuple } from '../study-conditions/cue.constants';
import { getRandomStimuli } from '../study-conditions/get-random-stimuli';
import { StimuliNetworkTuple } from '../study-conditions/stimuli.interfaces';
import { StimulusCase } from '../study-conditions/stimulus-case';
import { StimuliComparison } from './stimuli-comparison';

export abstract class Network {

  case: StimulusCase;
  num: number;
  selectedAtoBAToCOperators: CueTuple<CueNonArbitrary>;
  stimuli: StimuliNetworkTuple;

  /**
   * Creates a network.
   * @param {number} num specifies the number of the network. For example, num 1 would be Network 1.
   * @param {StimulusCase} stimulusCase specifies the trigram case of the network. Upper or lowercase.
   * @param {CueTuple<CueNonArbitrary>[]} aToBAToCOperatorOptions specifies the available A to B and A to C operators that can be randomly selected.
   * @protected
   */
  protected constructor(
    num: number,
    stimulusCase: StimulusCase,
    aToBAToCOperatorOptions: CueTuple<CueNonArbitrary>[]
  ) {
    this.num = num;
    this.case = stimulusCase;
    this.stimuli = getRandomStimuli(3, stimulusCase) as StimuliNetworkTuple;
    this.selectedAtoBAToCOperators = sample(aToBAToCOperatorOptions) as CueTuple<CueNonArbitrary>;
  }

  /**
   * Generates the identity stimulus comparisons A to A, B to B, and C to C.
   * @returns {StimuliComparison[]}
   */
  get identities(): StimuliComparison[] {
    return this.stimuli.map(stimulus => {
      return {
        cue: CUE_NON_ARBITRARY.same,
        stimuli: [stimulus, stimulus]
      };
    });
  }

  /**
   * Generates the trained stimulus comparisons A to B, and A to C.
   * @returns {StimuliComparison[]}
   */
  get trained(): StimuliComparison[] {
    const [A, B, C] = this.stimuli;
    return [
      {
        cue: this.selectedAtoBAToCOperators[0],
        stimuli: [A, B]
      },
      {
        cue: this.selectedAtoBAToCOperators[1],
        stimuli: [A, C]
      }
    ];
  }

  /**
   * Generates stimuli comparison in string form to make it easier to view networks
   * in the dev console.
   * @param {StimuliComparison[]} comparison
   * @returns {string}
   */
  comparisonToString(comparison: StimuliComparison[]): string {
    return comparison.map(
      ({ cue, stimuli: [stimulus1, stimulus2] }) => `${stimulus1} ${cue} ${stimulus2}`).join(', ');
  }

  /**
   * Generates a string that shows the network number, and stimulus comparisons
   * @returns {string}
   */
  abstract toString(): string
}

