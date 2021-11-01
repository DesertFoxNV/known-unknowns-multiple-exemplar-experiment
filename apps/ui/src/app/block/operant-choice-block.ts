import { shuffle } from 'lodash-es';
import { KnownEqualityNetwork } from '../network/known-equality-network';
import { KnownGreaterThanNetwork } from '../network/known-greater-than-network';
import { StimuliComparison } from '../network/stimuli-comparison';
import {
  BUTTON_TEXT_FILE_PATH, CUE_NON_ARBITRARY, CUE_NON_ARBITRARY_TO_FILENAME, CUE_TYPE, CueNonArbitrary,
  CUES_NON_ARBITRARY_W_ICK, CUES_NON_ARBITRARY_WO_ICK
} from '../study-conditions/cue.constants';
import { StudyConfig } from '../study-config-form/study-config';
import { Trial } from '../trial/trial';
import { Block } from './block';

export class OperantChoiceBlock extends Block {
  equalityNetwork: KnownEqualityNetwork;
  greaterThanNetwork: KnownGreaterThanNetwork;
  stimuliComparisonCopies = 2;

  constructor(
    equalityNetwork: KnownEqualityNetwork,
    greaterThanNetwork: KnownGreaterThanNetwork,
    config: StudyConfig
  ) {
    super('Operant Choice', config);
    this.equalityNetwork = equalityNetwork;
    console.log(this.equalityNetwork.toString());
    this.greaterThanNetwork = greaterThanNetwork;
    console.log(this.greaterThanNetwork.toString());
  }

  /**
   * Creates trials.
   * @returns {unknown[] | Array<Trial[][keyof Trial[]]>}
   */
  createTrials() {
    // Cue order is randomized
    const cues = shuffle(this.config.iCannotKnow ? CUES_NON_ARBITRARY_W_ICK : CUES_NON_ARBITRARY_WO_ICK);

    // Cue component configurations are mapped from cue order
    const cueComponentConfigs = cues.map((cue) => ({
      isArbitrary: this.config.cueType === CUE_TYPE.arbitrary,
      fileName: this.config.cueType === CUE_TYPE.nonArbitrary ? BUTTON_TEXT_FILE_PATH :
        CUE_NON_ARBITRARY_TO_FILENAME[cue],
      value: cue
    }));

    // I cannot know trials are created, mapped to component configs, and shuffled.
    const ickStimuliComparisons: StimuliComparison[] = [];
    for (const stimuli1 of this.equalityNetwork.stimuli) {
      for (const stimuli2 of this.greaterThanNetwork.stimuli) {
        ickStimuliComparisons.push(
          {
            cue: CUE_NON_ARBITRARY.iCannotKnow,
            stimuli: [stimuli1, stimuli2]
          },
          { cue: CUE_NON_ARBITRARY.iCannotKnow, stimuli: [stimuli2, stimuli1] });
      }
    }
    console.log(ickStimuliComparisons.length);

    // pool network comparisons
    const comparisons: StimuliComparison[] = [this.equalityNetwork, this.greaterThanNetwork].map(network => {
      return ([] as StimuliComparison[]).concat(
        network.trained,
        network.mutuallyEntailed,
        network.combinatoriallyEntailed
      );
    }).flat().concat(this.config.iCannotKnow ? ickStimuliComparisons : []);

    // create record of cue with stimuli
    const cueByStimuli = CUES_NON_ARBITRARY_W_ICK.reduce(
      (acc, cue) => ({ ...acc, [cue]: comparisons.filter(comparison => comparison.cue === cue) }),
      {} as Record<CueNonArbitrary, StimuliComparison[]>);

    const cueCountsByStimuli = CUES_NON_ARBITRARY_W_ICK.reduce(
      (acc, cue) => ({ ...acc, [cue]: comparisons.filter(comparison => comparison.cue === cue).length }),
      {} as Record<CueNonArbitrary, number>);

    const gcd = (a: number, b: number): number => a ? gcd(b % a, a) : b;
    const lcm = (a: number, b: number) => a * b / gcd(a, b);

    const leastCommonMultiple = Object.values(cueCountsByStimuli).filter(
      cueCountsByStimuli => cueCountsByStimuli > 0).reduce(lcm);
    console.log('LEAST COMMON MULTIPLE', leastCommonMultiple);

    const cueMultiplierByStimuli = CUES_NON_ARBITRARY_W_ICK.reduce(
      (acc, cue) => ({
        ...acc,
        [cue]: leastCommonMultiple / comparisons.filter(comparison => comparison.cue === cue).length
      }),
      {} as Record<CueNonArbitrary, number>);

    console.log('CUE BY STIMULI', cueByStimuli);
    console.log('CUE COUNT BY STIMULI', cueCountsByStimuli);
    console.log('CUE MULTIPLIER BY STIMULI', cueMultiplierByStimuli);

    const transformedConfigBalance: Record<CueNonArbitrary, number> = {
      'DIFFERENT': 0,
      SAME: this.config.balance.equalTo,
      'GREATER THAN': this.config.balance.greaterThan,
      'LESS THAN': this.config.balance.lessThan,
      'I CANNOT KNOW': this.config.balance?.iCannotKnow || 1
    };

    const balanced = transformedConfigBalance.SAME === cueCountsByStimuli.SAME &&
      transformedConfigBalance['LESS THAN'] === cueCountsByStimuli['LESS THAN'] &&
      transformedConfigBalance['GREATER THAN'] === cueCountsByStimuli['GREATER THAN'] &&
      (!this.config.iCannotKnow || transformedConfigBalance['I CANNOT KNOW'] === cueCountsByStimuli['I CANNOT KNOW']);

    for (const cue of CUES_NON_ARBITRARY_W_ICK) {
      if (cueCountsByStimuli[cue] === 0) continue;
      const trialNumArray = new Array(
        (balanced ? cueMultiplierByStimuli[cue] : cueMultiplierByStimuli[cue] * transformedConfigBalance[cue]) *
        this.stimuliComparisonCopies).fill(
        undefined).map((_, i) => i + 1);
      for (const num of trialNumArray) {
        this.trials = this.trials.concat(
          cueByStimuli[cue].flat().map(stimuliComparison => ({ ...stimuliComparison, cueComponentConfigs })));
      }
    }

    console.log('un-shuffled trials', this.trials);

    return shuffle(this.trials);
  }

  /**
   * Feedback is enabled in the operant choice block.
   * @returns {boolean}
   */
  feedbackEnabled(): boolean {
    return true;
  }
}
