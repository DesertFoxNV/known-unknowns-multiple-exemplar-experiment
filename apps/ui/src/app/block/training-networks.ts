import { shuffle } from 'lodash-es';
import { RelationalFrameGraph } from '../graph/relational-frame-graph';
import { StudyConfig, StudyConfigWCase } from '../study-config-form/study-config';
import { CueSelected } from '../trial/cue-selected';
import { FADE_OUT_DURATION_MS } from '../trial/fade-out-duration';
import { Trial } from '../trial/trial';
import { FEEDBACK_DURATION_MS, FEEDBACK_FADE_OUT_DELAY_MS } from '../trial/trial-correct/feedback-duration';
import { Block } from './block';
import { BlockComponent } from './block.component';
import { randomizedComponentConfigs } from './cue-component-configs';
import { TRIAL_DELAY_INTERVAL_MS } from './trial-animation-delay';

export class TrainingNetworks extends Block {
  graph: RelationalFrameGraph;
  numAllottedTimeouts = 1;
  numIdkProbeTrials = 5;
  numProbeDuplicates = 4;
  numProbeTrials = 32;
  numTimeouts = 0;
  numTrainingDuplicates = 2;
  numTrainingTrials = 20;
  probeFailuresAllotted = 2;
  probesFailed = 0;
  sequentialCorrect = 0;
  sequentialCorrectTarget = 23;
  timeout?: NodeJS.Timeout;

  /**
   * Training Networks Block
   *  Training: 20 trials
   *    6 identities (A3:A3, B3:B3, C3:C3, A4:A4, B4:B4, C4:C4) * 2 duplicates
   *    4 trained (e.g. A3:B3, B3:C3, A4:B4, A4:C4) * 2 duplicates
   *  W-ICK: 32 trials (12 greater than, 12 less than, 8 idk)
   *    16 mutually entailed trials (default) = mutually-entailed (B:A, C:A) * numDuplicates (4 default) * 2 networks
   *    16 combinatorially entailed trials (default) = combinatorially-entailed (B:C, C:B) * numDuplicates  (4 default) * 2 networks
   * @param {StudyConfig} config
   * @param graph
   */
  constructor(
    config: StudyConfigWCase,
    graph: RelationalFrameGraph
  ) {
    super('Training Networks', config);
    this.graph = graph;
  }

  complete() {
    if (this.timeout) clearTimeout(this.timeout);
    super.complete();
  }

  /**
   * Creates test block trials.
   * @returns {unknown[] | Array<Trial[][keyof Trial[]]>}
   */
  createTrials() {

    // Identity and trained trials are generated for each network
    let trainingTrials: Trial[] = [];
    for (let i = 0; i < this.numTrainingDuplicates; i++) {
      trainingTrials = trainingTrials.concat([
        this.graph.identities,
        this.graph.trained
      ].flat().map(
        stimuliComparison => ({ ...stimuliComparison, cueComponentConfigs: randomizedComponentConfigs(this.config) })
      ));
    }

    // Checks to make sure the number of training trials doesn't exceed the specified length
    if (trainingTrials.length !== this.numTrainingTrials) throw Error(
      `Training trials length "${trainingTrials.length}" doesn't equal specified length "${this.numTrainingTrials}"`);

    // Probe trials are created, mapped to component configs, and shuffled.
    let probeTrials: Trial[] = [];
    for (let i = 0; i < this.numProbeDuplicates; i++) {
      probeTrials = probeTrials.concat([
          this.graph.mutuallyEntailed,
          this.graph.combinatoriallyEntailed
        ].flat().map(
          stimuliComparison => ({ ...stimuliComparison, cueComponentConfigs: randomizedComponentConfigs(this.config) }))
      );
    }

    // Checks to make sure the number of probe trials doesn't exceed the specified length
    if (probeTrials.length !== this.numProbeTrials) throw Error(
      `Probe trials length "${probeTrials.length}" doesn't equal specified length "${this.numIdkProbeTrials}"`);

    return shuffle(trainingTrials).concat(shuffle(probeTrials));
  }

  /**
   * Feedback only enabled in training
   * @returns {boolean}
   */
  feedbackEnabled(): boolean {
    return this.index < this.numTrainingTrials;
  }

  grade(selected: CueSelected|undefined): 'CORRECT'|'WRONG' {
    const isCorrect = selected?.cue.value === this.trial.relation;

    if (selected?.cue.value === this.trial.relation) {
      this.correct++;
      this.sequentialCorrect++;
    } else {
      this.sequentialCorrect = 0;
      this.incorrect++;
    }

    return isCorrect ? 'CORRECT' : 'WRONG';
  }

  /**
   * Next trial overrides the base class so that the trial can be segmented
   * into two phases training and probe. If the participant fails a phase they
   * are allowed to retry up to the amount of failures allotted, otherwise
   * the study is completed.
   */
  nextTrial(): void {
    console.log('trial num', this.trialNum);
    console.log('sequential correct', this.sequentialCorrect);
    console.log('percent correct', this.percentCorrect);
    // if sequential correct is greater than target advance to probe stage
    if (this.sequentialCorrect === this.sequentialCorrectTarget) this.index = this.numTrainingTrials - 1;

    // if training is passed reset the training failures allotted
    if (this.trialNum === this.numTrainingTrials && this.percentCorrect !== 100 && this.sequentialCorrect !==
      this.sequentialCorrectTarget) {
      console.log('training failed');

      this.reset();
      super.nextTrial();

      // If <90% correct of the number of the 24 trials presented that have a correct response (because the 8 KU trials do not have a ‘correct’ response without an IDK),
    } else if (this.trialNum === this.numProbeTrials + this.numTrainingTrials && this.percentCorrect <
      (this.config.iCannotKnow ? 90 : 75 * .9)) {
      this.probesFailed++;
      console.log('probes failed', this.probesFailed);

      // If probes failed equals the max probe failures allowed, the block completes, otherwise the participant retries the block
      if (this.probesFailed === this.probeFailuresAllotted) {
        this.failed();
      } else {
        this.retry();
      }
    } else {
      if (this.trialNum === this.numTrainingTrials) {
        if (this.timeout) clearTimeout(this.timeout);
        this.correct = 0;
        this.incorrect = 0;
      }
      super.nextTrial();
    }
  }

  /**
   * User is shown a retry block, which they have to click to continue.
   */
  retry() {
    this.attempts++;
    this.component?.setVisibility(false);
    this.component?.prompt('CLICK TO TRY AGAIN', false,
      TRIAL_DELAY_INTERVAL_MS + (this.feedBackShown ? FEEDBACK_FADE_OUT_DELAY_MS : FADE_OUT_DURATION_MS)).subscribe(
      () => {
        this.feedBackShown = false;
        this.component?.setVisibility(true, 0);
        this.nextTrial();
        this.setTimeout();
      });
    this.reset();
  }

  setTimeout() {
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.component?.trialComponent?.clearTimer();
      this.numTimeouts++;
      if (this.numTimeouts > this.numAllottedTimeouts) {
        this.failed();
      } else {
        this.retry();
      }
    }, 50 * this.trials.length * (this.config.trialTimeoutSeconds * 1000 + FEEDBACK_DURATION_MS));
  }

  /***
   * Resets block index, binds to the view, and shows a message.
   * @param {BlockComponent} component
   */
  start(component: BlockComponent) {
    this.component = component;
    if (this.trials.length === 0) this.reset();
    component.prompt('CLICK TO START', false, TRIAL_DELAY_INTERVAL_MS)
      .subscribe(() => {
        this.setTimeout();
        this.component?.setVisibility(true, 0);
        this.nextTrial();
      });
  }
}
