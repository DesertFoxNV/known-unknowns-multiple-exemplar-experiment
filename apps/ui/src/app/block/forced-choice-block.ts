import { cloneDeep, sampleSize, shuffle } from 'lodash-es';
import { BinaryNetwork } from '../network/binary-network';
import { StimuliComparison } from '../network/stimuli-comparison';
import { CUE_NON_ARBITRARY } from '../study-conditions/cue.constants';
import { StudyConfig } from '../study-config-form/study-config';
import { Trial } from '../trial/trial';
import { Block } from './block';
import { oneChoiceCueComponentConfig, twoChoiceCueComponentConfig } from './one-choice-cue-component-config';

/***
 * WO-IDK: 12 trials
 *  6 identities (A:A x 2, B:B x 2, C:C x 2)
 *  6 different (A:B, B:C, C:A, B:A, C:B, A:C)
 * W -IDK: 18 trials
 *  6 identities (A:A x 2, B:B x 2, C:C x 2)
 *  6 different (A:B, B:C, C:A, B:A, C:B, A:C)
 *  6 ick (A:D, B:E, C:F, A:F, B:D, C:E ... select 6 of 18 combinations)
 ***/
export class ForcedChoiceBlock extends Block {
  attempts = 0;
  network1: BinaryNetwork; // (A, B, C)
  network2: BinaryNetwork; // (D, E, F)

  constructor(
    network1: BinaryNetwork,
    network2: BinaryNetwork,
    config: StudyConfig
  ) {
    super('Forced choice block', config);
    this.network1 = network1;
    this.network2 = network2;
  }

  complete() {
    this.attempts++;
    console.log('attempts', this.attempts);
    /**
     * Trial should be repeated if there are any incorrect answers
     *
     */
    if (this.trials.length - this.correctCount === 0) {
      this.completed = new Date();
      this.component?.showMessage('BLOCK COMPLETE', true);
    } else {
      this.reset();
      this.component?.showMessage('REPEAT BLOCK');
      this.component?.setVisibility(true);
    }
  }

  createTrials() {
    const sameCueComponentConfigs = oneChoiceCueComponentConfig(this.config, CUE_NON_ARBITRARY.same);
    const differentCueComponentConfig = oneChoiceCueComponentConfig(this.config, CUE_NON_ARBITRARY.different);
    const ickCueComponentConfig = oneChoiceCueComponentConfig(this.config, CUE_NON_ARBITRARY.iCannotKnow);

    const sameTrials = shuffle([
      this.network1.identities,
      this.network1.identities
    ].flat().map(stimuliComparison => ({ ...stimuliComparison, cueComponentConfigs: sameCueComponentConfigs })));

    const differentTrials = shuffle([
      this.network1.trained,
      this.network1.mutuallyEntailed,
      this.network1.combinatoriallyEntailed
    ].flat().map((stimuliComparison) => ({ ...stimuliComparison, cueComponentConfigs: differentCueComponentConfig })));

    const ickStimuliComparisons: StimuliComparison[] = [];
    for (const stimuli1 of this.network1.stimuli) {
      for (const stimuli2 of this.network2.stimuli) {
        ickStimuliComparisons.push(
          {
            cue: CUE_NON_ARBITRARY.iCannotKnow,
            stimuli: [stimuli1, stimuli2]
          },
          { cue: CUE_NON_ARBITRARY.iCannotKnow, stimuli: [stimuli2, stimuli1] });
      }
    }

    const sameAndDifferentTrials = sameTrials.concat(differentTrials);

    const ickTrials = ickStimuliComparisons.map(
      (stimuliComparison) => ({ ...stimuliComparison, cueComponentConfigs: ickCueComponentConfig }));

    const probeTrials: Trial[] = shuffle(cloneDeep(sampleSize(differentTrials, 5))
      .concat(cloneDeep(sampleSize(ickTrials, 5)))
      .map(trial => {
        trial.cueComponentConfigs = twoChoiceCueComponentConfig(this.config, CUE_NON_ARBITRARY.different,
          CUE_NON_ARBITRARY.iCannotKnow);
        return trial;
      }));

    this.trials = this.config.iCannotKnow ? sameAndDifferentTrials.concat(sampleSize(ickTrials, 6), probeTrials) :
      sameAndDifferentTrials;

  }

  feedbackEnabled(): boolean {
    return this.index < 18;
  }
}
