import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { cloneDeep, sampleSize, shuffle } from 'lodash-es';
import { Network1And2Graph } from '../../graph/network-1-and-2-graph';
import { OverlayService } from '../../overlay/overlay.service';
import { ReportService } from '../../report/report.service';
import { CUE_NON_ARBITRARY } from '../../study-conditions/cue.constants';
import { Trial } from '../../trial/trial';
import { TrialCounterService } from '../../trial/trial-counter.service';
import { BlockComponent } from '../block.component';
import { oneChoiceCueComponentConfig, twoChoiceCueComponentConfig } from '../cue-component-configs';

@Component({
  selector: 'forced-choice-block',
  templateUrl: './forced-choice-block.component.html',
  styleUrls: ['./forced-choice-block.component.scss'],
  animations: []
})
export class ForcedChoiceBlockComponent extends BlockComponent implements OnInit {
  name = 'Forced Choice';
  numDifferentProbeTrials = 5;
  numIdkProbeTrials = 5;
  numIdkTrainingTrials = 6;
  numProbeTrials = 10;
  probeFailuresAllotted = 10;
  probesFailed = 0;
  startInstructions = 'TAKE A BREAK.\n CLICK TO CONTINUE';
  trainingFailuresAllotted = 10;
  trainingsFailed = 0;

  /**
   * Forced Choice Block
   *  WO-ICK: 12 trials
   *    6 identities (A:A x 2, B:B x 2, C:C x 2)
   *    6 different (A:B, B:C, C:A, B:A, C:B, A:C)
   *  W-ICK: 18 trials
   *    6 identities (A:A x 2, B:B x 2, C:C x 2)
   *    6 different (A:B, B:C, C:A, B:A, C:B, A:C)
   *    6 ick (A:D, B:E, C:F, A:F, B:D, C:E ... select 6 of 18 combinations)
   * @param dialog
   * @param overlaySvc
   * @param reportSvc
   * @param trialCounterSvc
   * @param network1And2Graph
   */
  constructor(
    dialog: MatDialog,
    overlaySvc: OverlayService,
    reportSvc: ReportService,
    trialCounterSvc: TrialCounterService,
    private network1And2Graph: Network1And2Graph
  ) {
    super(dialog, overlaySvc, reportSvc, trialCounterSvc);
  }

  get numTrainingTrials() {
    if (!this.studyConfig) throw Error('Study configuration is undefined');
    return this.studyConfig.iCannotKnow ? 18 : 12;
  }

  /**
   * Creates test block trials.
   * @returns {unknown[] | Array<Trial[][keyof Trial[]]>}
   */
  createTrials() {
    const { studyConfig } = this; // defined locally so that typescript can properly infer types
    if (!studyConfig) throw Error('Study studyConfig not defined');

    // Cue component configs are generated for the same, different and ick configs
    const sameCueComponentConfigs = oneChoiceCueComponentConfig(studyConfig, CUE_NON_ARBITRARY.same);
    const differentCueComponentConfig = oneChoiceCueComponentConfig(studyConfig, CUE_NON_ARBITRARY.different);
    const ickCueComponentConfig = oneChoiceCueComponentConfig(studyConfig, CUE_NON_ARBITRARY.iCannotKnow);

    // Only include identities for network 1
    const network1Identities = this.network1And2Graph.identities.filter(
      stimulusComparision => stimulusComparision.stimuli[0].network === 1);

    // Same trials are created in duplicate, mapped to component configs, and shuffled.
    const sameTrials = shuffle([
      network1Identities,
      network1Identities
    ].flat().map(stimuliComparison => ({ ...stimuliComparison, cueComponentConfigs: sameCueComponentConfigs })));

    // Different trials are created, mapped to component configs, and shuffled.
    const differentTrials = shuffle([
      this.network1And2Graph.trained,
      this.network1And2Graph.mutuallyEntailed
    ].flat().map((stimuliComparison) => ({ ...stimuliComparison, cueComponentConfigs: differentCueComponentConfig })));

    // I cannot know trials are created, mapped to component configs, and shuffled.
    const ickTrials = shuffle([
      // Remove network 2 comparison with filter
      this.network1And2Graph.combinatoriallyEntailed.filter(
        stimulusComparison => !(stimulusComparison.stimuli[0].network === 2 && stimulusComparison.stimuli[1].network ===
          2))
    ].flat().map((stimuliComparison) => ({ ...stimuliComparison, cueComponentConfigs: ickCueComponentConfig })));

    // Training trials are created conditionally. I cannot know trials are only added to training if the ick option is enabled.
    const trainingTrials = studyConfig.iCannotKnow ?
      sameTrials.concat(differentTrials, sampleSize(ickTrials, this.numIdkTrainingTrials)) :
      sameTrials.concat(differentTrials);

    // Checks to make sure the number of training trials doesn't exceed the specified length
    if (trainingTrials.length > this.numTrainingTrials) throw Error(
      `Training trials length "${trainingTrials.length}" is greater than specified length "${this.numTrainingTrials}"`);

    // Probe trials are created, mapped to component configs, and shuffled.
    const probeTrials: Trial[] = shuffle(cloneDeep(sampleSize(differentTrials, this.numDifferentProbeTrials))
      .concat(cloneDeep(sampleSize(ickTrials, this.numIdkProbeTrials)))
      .map(trial => {
        trial.cueComponentConfigs = twoChoiceCueComponentConfig(studyConfig, CUE_NON_ARBITRARY.different,
          CUE_NON_ARBITRARY.iCannotKnow);
        return trial;
      }));

    // Checks to make sure the number of probe trials doesn't exceed the specified length
    if (probeTrials.length > this.numProbeTrials) throw Error(
      `Probe trials length "${probeTrials.length}" is greater than specified length "${this.numIdkProbeTrials}"`);

    // If i cannot know is enabled the then the probe trials are included in the block, otherwise just the training trials are included.
    return studyConfig.iCannotKnow ? trainingTrials.concat(probeTrials) : trainingTrials;
  }

  /**
   * Feedback only enabled in training
   * @returns {boolean}
   */
  feedbackEnabled(): boolean {
    return this.index < this.numTrainingTrials;
  }

  // /**
  //  * Next trial overrides the base class so that the trial can be segmented
  //  * into two phases training and probe. If the participant fails a phase they
  //  * are allowed to retry up to the amount of failures allotted, otherwise
  //  * the study is completed.
  //  */
  // nextTrial(): void {
  //
  //   if (this.trialNum === this.numTrainingTrials && this.percentCorrect !== 100) {
  //     this.trainingsFailed++;
  //     this.incrementTrainingAttempts();
  //
  //     // If trainings failed equals the max training failures allowed, the block completes, otherwise the participant retries the block
  //     if (this.trainingsFailed >= this.trainingFailuresAllotted) {
  //       this.failed();
  //     } else {
  //       this.retry();
  //     }
  //
  //   } else if ((this.trialNum === this.numProbeTrials + this.numTrainingTrials) && this.percentCorrect !== 100) {
  //     this.probesFailed++;
  //     this.incrementProbeAttempts();
  //
  //     // If probes failed equals the max probe failures allowed, the block completes, otherwise the participant retries the block
  //     if (this.probesFailed >= this.probeFailuresAllotted) {
  //       this.failed();
  //     } else {
  //       this.retry();
  //     }
  //   } else {
  //     // if training is passed reset the training failures allotted
  //     if (this.trialNum >= this.numTrainingTrials) this.trainingsFailed = 0;
  //     super.nextTrial();
  //   }
  // }

  ngOnInit(): void {
    this.start();
  }
}
