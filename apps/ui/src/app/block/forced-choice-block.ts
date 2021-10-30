import { cloneDeep, sampleSize, shuffle } from 'lodash-es';
import { BinaryNetwork } from '../network/binary-network';
import { StimuliComparison } from '../network/stimuli-comparison';
import { CUE_NON_ARBITRARY } from '../study-conditions/cue.constants';
import { StudyConfig } from '../study-config-form/study-config';
import { FADE_OUT_DURATION_MS } from '../trial/fade-out-duration';
import { Trial } from '../trial/trial';
import { FEEDBACK_FADE_OUT_DELAY_MS } from '../trial/trial-correct/feedback-duration';
import { Block } from './block';
import { oneChoiceCueComponentConfig, twoChoiceCueComponentConfig } from './one-choice-cue-component-config';
import { TRIAL_DELAY_INTERVAL_MS } from './trial-animation-delay';

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
  network1: BinaryNetwork; // (A, B, C)
  network2: BinaryNetwork; // (D, E, F)
  numDifferentProbeTrials = 5;
  numIdkProbeTrials = 5;
  numIdkTrainingTrials = 6;
  numProbeTrials = 10;
  numTrainingTrials = this.config.iCannotKnow ? 18 : 12;
  probeFailuresAllotted = 2;
  probesFailed = 0;
  trainingFailuresAllotted = 2;
  trainingsFailed = 0;

  constructor(
    network1: BinaryNetwork,
    network2: BinaryNetwork,
    config: StudyConfig
  ) {
    super('Forced choice block', config);
    this.network1 = network1;
    this.network2 = network2;
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

    const ickTrials = ickStimuliComparisons.map(
      (stimuliComparison) => ({ ...stimuliComparison, cueComponentConfigs: ickCueComponentConfig }));

    const trainingTrials = this.config.iCannotKnow ?
      sameTrials.concat(differentTrials, sampleSize(ickTrials, this.numIdkTrainingTrials)) :
      sameTrials.concat(differentTrials);

    if (trainingTrials.length > this.numTrainingTrials) throw Error(
      `Training trials length "${trainingTrials.length}" is greater than specified length "${this.numTrainingTrials}"`);

    const probeTrials: Trial[] = shuffle(cloneDeep(sampleSize(differentTrials, this.numDifferentProbeTrials))
      .concat(cloneDeep(sampleSize(ickTrials, this.numIdkProbeTrials)))
      .map(trial => {
        trial.cueComponentConfigs = twoChoiceCueComponentConfig(this.config, CUE_NON_ARBITRARY.different,
          CUE_NON_ARBITRARY.iCannotKnow);
        return trial;
      }));

    if (probeTrials.length > this.numProbeTrials) throw Error(
      `Probe trials length "${probeTrials.length}" is greater than specified length "${this.numIdkProbeTrials}"`);

    return this.config.iCannotKnow ? trainingTrials.concat(probeTrials) : trainingTrials;
  }

  feedbackEnabled(): boolean {
    return this.index < this.numTrainingTrials;
  }

  nextTrial(): void {
    // If training failed
    if (this.trialNum === this.numTrainingTrials && this.percentCorrect !== 100) {
      this.trainingsFailed++;
      console.log('training failed', this.trialNum);
      console.log('trainingsFailed', this.trainingsFailed);

      // If trainings failed equal the max training failures allowed, the block completes.
      if (this.trainingsFailed === this.trainingFailuresAllotted) {
        this.failed();
      } else {
        this.retry();
      }

    } else if (this.trialNum === this.numProbeTrials + this.numTrainingTrials && this.percentCorrect !== 100) {
      this.probesFailed++;
      console.log('training failed', this.trialNum);
      console.log('probesFailed', this.probesFailed);

      // If probes failed equal the max probe failures allowed, the block completes.
      if (this.probesFailed === this.probeFailuresAllotted) {
        this.failed();
      } else {
        this.retry();
      }
    } else {
      super.nextTrial();
    }
  }

  retry() {
    this.attempts++;
    this.component?.setVisibility(false);
    this.component?.prompt('CLICK TO TRY AGAIN', false,
      TRIAL_DELAY_INTERVAL_MS + (this.feedBackShown ? FEEDBACK_FADE_OUT_DELAY_MS : FADE_OUT_DURATION_MS)).subscribe(
      () => {
        this.feedBackShown = false;
        this.component?.setVisibility(true, 0);
        this.nextTrial();
      });
    this.reset();
  }
}
