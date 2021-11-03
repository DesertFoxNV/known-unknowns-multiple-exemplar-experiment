import { isEqual, shuffle } from 'lodash-es';
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

const gcd = (a: number, b: number): number => a ? gcd(b % a, a) : b;
const lcm = (a: number, b: number) => a * b / gcd(a, b);

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

    // Cue component configurations are mapped from relation order
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
            relation: CUE_NON_ARBITRARY.iCannotKnow,
            stimuli: [stimuli1, stimuli2]
          },
          { relation: CUE_NON_ARBITRARY.iCannotKnow, stimuli: [stimuli2, stimuli1] });
      }
    }

    // pool network comparisons
    const comparisons: StimuliComparison[] = [this.equalityNetwork, this.greaterThanNetwork].map(network => {
      return ([] as StimuliComparison[]).concat(
        network.trained,
        network.mutuallyEntailed,
        network.combinatoriallyEntailed
      );
    }).flat().concat(this.config.iCannotKnow ? ickStimuliComparisons : []);

    // creates a record of relation type to unique stimuli comparisons
    const cueByStimuli = CUES_NON_ARBITRARY_W_ICK.reduce(
      (acc, cue) => ({ ...acc, [cue]: comparisons.filter(comparison => comparison.relation === cue) }),
      {} as Record<CueNonArbitrary, StimuliComparison[]>);

    // creates a record of relation type to relation count
    const cueCountsByStimuli = CUES_NON_ARBITRARY_W_ICK.reduce(
      (acc, cue) => ({ ...acc, [cue]: comparisons.filter(comparison => comparison.relation === cue).length }),
      {} as Record<CueNonArbitrary, number>);

    // determines least common multiple of relation counts to create equal counts of each stimuli.
    const cueCountsLeastCommonMultiple = Object.values(cueCountsByStimuli).filter(
      cueCountsByStimuli => cueCountsByStimuli > 0).reduce(lcm);

    // creates a record
    const cueMultiplierByStimuli = CUES_NON_ARBITRARY_W_ICK.reduce(
      (acc, cue) => ({
        ...acc,
        [cue]: cueCountsLeastCommonMultiple / comparisons.filter(comparison => comparison.relation === cue).length
      }),
      {} as Record<CueNonArbitrary, number>);

    console.log('CUE BY STIMULI', cueByStimuli);
    console.log('CUE COUNT BY STIMULI', cueCountsByStimuli);
    console.log('CUE MULTIPLIER BY STIMULI', cueMultiplierByStimuli);

    const balanceGcd = Object.values(this.config.balance)
      .filter(b => b)
      .reduce(gcd);

    const configBalanceDividedByGcd: Record<CueNonArbitrary, number> = {
      'DIFFERENT': 0,
      SAME: this.config.balance.equalTo / balanceGcd,
      'GREATER THAN': this.config.balance.greaterThan / balanceGcd,
      'LESS THAN': this.config.balance.lessThan / balanceGcd,
      'I CANNOT KNOW': this.config.balance?.iCannotKnow ? this.config.balance.iCannotKnow / balanceGcd : 0
    };

    console.log('balance', configBalanceDividedByGcd);

    const balanceTimesMultiplier: Record<CueNonArbitrary, number> = {
      'DIFFERENT': 0,
      SAME: (this.config.balance.equalTo * cueMultiplierByStimuli.SAME),
      'GREATER THAN': (this.config.balance.greaterThan * cueMultiplierByStimuli['GREATER THAN']),
      'LESS THAN': (this.config.balance.lessThan * cueMultiplierByStimuli['LESS THAN']),
      'I CANNOT KNOW': this.config.balance?.iCannotKnow ?
        (this.config.balance.iCannotKnow * cueMultiplierByStimuli['I CANNOT KNOW']) : 0
    };

    const multiplierGcd = Object.values(balanceTimesMultiplier)
      .filter(b => b)
      .reduce(gcd);

    for (const cue of CUES_NON_ARBITRARY_W_ICK) {
      if (cueCountsByStimuli[cue] === 0) continue;
      const numberOfTrials = balanceTimesMultiplier[cue] / multiplierGcd * this.stimuliComparisonCopies;

      for (const trial of new Array(numberOfTrials)) {
        this.trials = this.trials.concat(
          cueByStimuli[cue].flat().map(stimuliComparison => ({ ...stimuliComparison, cueComponentConfigs })));
      }
    }

    console.log(this.trials.length);

    this.shuffleUntilNoTriplicatesInARow();

    return this.trials;
  }

  /**
   * Feedback is enabled in the operant choice block.
   * @returns {boolean}
   */
  feedbackEnabled(): boolean {
    return true;
  }

  shuffleUntilNoTriplicatesInARow() {
    const store = [];
    // check for duplicates
    for (let i = 0; i < 10000; i++) {
      let duplicateAttempts = 0;
      let countsInARow = 2;
      const startTime = performance.now();
      while (countsInARow >= 2) {
        duplicateAttempts++;
        this.trials = shuffle(this.trials);
        let cachedTrial: Trial|undefined = undefined;
        for (const trial of this.trials) {
          if (!isEqual(trial.stimuli, cachedTrial?.stimuli)) {
            cachedTrial = trial;
            countsInARow = 0;
          } else {

            countsInARow++;
          }

          if (countsInARow === 3) break;
        }
      }
      const endTime = performance.now();
      store.push({ duration: endTime - startTime, attempts: duplicateAttempts });
    }

    console.log('store', store);
    console.log('Duration');
    console.log('\tMean', average(store.map(s => s.duration)) + ' ms');
    console.log('\tMedian', median(store.map(s => s.duration)) + ' ms');
    console.log('\tMode', median(store.map(s => s.duration)) + ' ms');
    console.log('Attempts');
    console.log('\tMean', average(store.map(s => s.attempts)));
    console.log('\tMedian', median(store.map(s => s.attempts)));
    console.log('\tMode', median(store.map(s => s.attempts)));
  }
}

const average = (array: number[]) => array.reduce((a, b) => a + b) / array.length;
// const median = (array: number[]) => {
//   const mid = Math.floor(array.length / 2),
//     nums = [...array].sort((a, b) => a - b);
//   return array.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
// };

const median = (array: number[]) => {
  // median of [3, 5, 4, 4, 1, 1, 2, 3] = 3
  let median = 0;
  const numsLen = array.length;
  array.sort();

  if (
    numsLen % 2 === 0 // is even
  ) {
    // average of two middle array
    median = (array[numsLen / 2 - 1] + array[numsLen / 2]) / 2;
  } else { // is odd
    // middle number only
    median = array[(numsLen - 1) / 2];
  }

  return median;
};

const mode = (array: number[]) => {
  // as result can be bimodal or multi-modal,
  // the returned result is provided as an array
  // mode of [3, 5, 4, 4, 1, 1, 2, 3] = [1, 3, 4]
  const modes = [];
  const count: number[] = [];
  let i, number, maxIndex = 0;

  for (i = 0; i < array.length; i += 1) {
    number = array[i];
    count[number] = (count[number] || 0) + 1;
    if (count[number] > maxIndex) {
      maxIndex = count[number];
    }
  }

  for (i in count)
    if (count?.[i]) {
      if (count[i] === maxIndex) {
        modes.push(Number(i));
      }
    }

  return modes;
};
