import { cloneDeep, sampleSize, shuffle } from 'lodash-es';
import {
  COMBINATORIALLY_ENTAILED_DICTIONARY_SAME_DIFFERENT_ICK, MUTUALLY_ENTAILED_DICTIONARY_SAME_DIFFERENT_ICK
} from '../graph/operator-dictionaries';
import { RelationType } from '../graph/relation-type';
import { RelationalEdge } from '../graph/relational-edge';
import { RelationalFrameGraph } from '../graph/relational-frame-graph';
import { RelationalNode } from '../graph/relational-node';
import { BinaryNetwork } from '../network/binary-network';
import { CUE_NON_ARBITRARY } from '../study-conditions/cue.constants';
import { getRandomStimulus } from '../study-conditions/get-random-stimuli';
import { StudyConfig, StudyConfigWCase } from '../study-config-form/study-config';
import { FADE_OUT_DURATION_MS } from '../trial/fade-out-duration';
import { Trial } from '../trial/trial';
import { FEEDBACK_FADE_OUT_DELAY_MS } from '../trial/trial-correct/feedback-duration';
import { Block } from './block';
import { oneChoiceCueComponentConfig, twoChoiceCueComponentConfig } from './cue-component-configs';
import { TRIAL_DELAY_INTERVAL_MS } from './trial-animation-delay';

export class ForcedChoiceBlock extends Block {
  graph: RelationalFrameGraph;
  numDifferentProbeTrials = 5;
  numIdkProbeTrials = 5;
  numIdkTrainingTrials = 6;
  numProbeTrials = 10;
  numTrainingTrials = this.config.iCannotKnow ? 18 : 12;
  probeFailuresAllotted = 2;
  probesFailed = 0;
  trainingFailuresAllotted = 2;
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
   * @param {BinaryNetwork} network1
   * @param {BinaryNetwork} network2
   * @param {StudyConfig} config
   */
  constructor(
    config: StudyConfigWCase
  ) {
    super('Forced Choice', config);
    this.graph = this.createGraph(config);
  }

  /**
   * Creates relational graph
   * @param {StudyConfigWCase} config
   * @returns {RelationalFrameGraph}
   */
  createGraph(config: StudyConfigWCase) {
    const graph = new RelationalFrameGraph(
      'same',
      'iCannotKnow',
      MUTUALLY_ENTAILED_DICTIONARY_SAME_DIFFERENT_ICK,
      COMBINATORIALLY_ENTAILED_DICTIONARY_SAME_DIFFERENT_ICK);

    graph.includeRelationsBetweenNetworks = true;

    // Network 1 - known network
    const nodeA1 = new RelationalNode('A', 1, getRandomStimulus(config.stimulusCase));
    const nodeB1 = new RelationalNode('B', 1, getRandomStimulus(config.stimulusCase));
    const nodeC1 = new RelationalNode('C', 1, getRandomStimulus(config.stimulusCase));

    // Add nodes for network 1
    graph.addNode(nodeA1);
    graph.addNode(nodeB1);
    graph.addNode(nodeC1);

    // Set A1 => B1 relation
    graph.addEdge(new RelationalEdge(nodeA1, nodeB1, 'different', RelationType.trained));
    graph.addEdge(new RelationalEdge(nodeA1, nodeC1, 'different', RelationType.trained));
    graph.addEdge(new RelationalEdge(nodeB1, nodeA1, 'different', RelationType.trained));
    graph.addEdge(new RelationalEdge(nodeB1, nodeC1, 'different', RelationType.trained));
    graph.addEdge(new RelationalEdge(nodeC1, nodeA1, 'different', RelationType.trained));
    graph.addEdge(new RelationalEdge(nodeC1, nodeB1, 'different', RelationType.trained));

    // Network 2 - unknown network
    const nodeD = new RelationalNode('D', 2, getRandomStimulus(config.stimulusCase));
    const nodeE = new RelationalNode('E', 2, getRandomStimulus(config.stimulusCase));
    const nodeF = new RelationalNode('F', 2, getRandomStimulus(config.stimulusCase));

    // Add nodes for network 2
    graph.addNode(nodeD);
    graph.addNode(nodeE);
    graph.addNode(nodeF);

    return graph;
  }

  /**
   * Creates test block trials.
   * @returns {unknown[] | Array<Trial[][keyof Trial[]]>}
   */
  createTrials() {
    // Cue component configs are generated for the same, different and ick configs
    const sameCueComponentConfigs = oneChoiceCueComponentConfig(this.config, CUE_NON_ARBITRARY.same);
    const differentCueComponentConfig = oneChoiceCueComponentConfig(this.config, CUE_NON_ARBITRARY.different);
    const ickCueComponentConfig = oneChoiceCueComponentConfig(this.config, CUE_NON_ARBITRARY.iCannotKnow);

    // Only include identities for network 1
    const network1Identities = this.graph.identities.filter(
      stimulusComparision => stimulusComparision.stimuli[0].network === 1);

    // Same trials are created in duplicate, mapped to component configs, and shuffled.
    const sameTrials = shuffle([
      network1Identities,
      network1Identities
    ].flat().map(stimuliComparison => ({ ...stimuliComparison, cueComponentConfigs: sameCueComponentConfigs })));

    // Different trials are created, mapped to component configs, and shuffled.
    const differentTrials = shuffle([
      this.graph.trained,
      this.graph.mutuallyEntailed
    ].flat().map((stimuliComparison) => ({ ...stimuliComparison, cueComponentConfigs: differentCueComponentConfig })));

    // I cannot know trials are created, mapped to component configs, and shuffled.
    const ickTrials = shuffle([
      // Remove network 2 comparison with filter
      this.graph.combinatoriallyEntailed.filter(
        stimulusComparison => !(stimulusComparison.stimuli[0].network === 2 && stimulusComparison.stimuli[1].network ===
          2))
    ].flat().map((stimuliComparison) => ({ ...stimuliComparison, cueComponentConfigs: ickCueComponentConfig })));

    // Training trials are created conditionally. I cannot know trials are only added to training if the ick option is enabled.
    const trainingTrials = this.config.iCannotKnow ?
      sameTrials.concat(differentTrials, sampleSize(ickTrials, this.numIdkTrainingTrials)) :
      sameTrials.concat(differentTrials);

    // Checks to make sure the number of training trials doesn't exceed the specified length
    if (trainingTrials.length > this.numTrainingTrials) throw Error(
      `Training trials length "${trainingTrials.length}" is greater than specified length "${this.numTrainingTrials}"`);

    // Probe trials are created, mapped to component configs, and shuffled.
    const probeTrials: Trial[] = shuffle(cloneDeep(sampleSize(differentTrials, this.numDifferentProbeTrials))
      .concat(cloneDeep(sampleSize(ickTrials, this.numIdkProbeTrials)))
      .map(trial => {
        trial.cueComponentConfigs = twoChoiceCueComponentConfig(this.config, CUE_NON_ARBITRARY.different,
          CUE_NON_ARBITRARY.iCannotKnow);
        return trial;
      }));

    // Checks to make sure the number of probe trials doesn't exceed the specified length
    if (probeTrials.length > this.numProbeTrials) throw Error(
      `Probe trials length "${probeTrials.length}" is greater than specified length "${this.numIdkProbeTrials}"`);

    // If i cannot know is enabled the then the probe trials are included in the block, otherwise just the training trials are included.
    return this.config.iCannotKnow ? trainingTrials.concat(probeTrials) : trainingTrials;
  }

  /**
   * Feedback only enabled in training
   * @returns {boolean}
   */
  feedbackEnabled(): boolean {
    return this.index < this.numTrainingTrials;
  }

  /**
   * Next trial overrides the base class so that the trail can be segmented
   * into two phases training and probe. If the participant fails a phase they
   * are allowed to retry up to the amount of failures allotted, otherwise
   * the study is completed.
   */
  nextTrial(): void {
    // if training is passed reset the training failures allotted
    if (this.trialNum === this.numTrainingTrials) this.trainingFailuresAllotted = 0;

    if (this.trialNum === this.numTrainingTrials && this.percentCorrect !== 100) {
      this.trainingsFailed++;
      console.log('training failed', this.trialNum);
      console.log('trainingsFailed', this.trainingsFailed);

      // If trainings failed equals the max training failures allowed, the block completes, otherwise the participant retries the block
      if (this.trainingsFailed === this.trainingFailuresAllotted) {
        this.failed();
      } else {
        this.retry();
      }

    } else if (this.trialNum === this.numProbeTrials + this.numTrainingTrials && this.percentCorrect !== 100) {
      this.probesFailed++;
      console.log('training failed', this.trialNum);
      console.log('probesFailed', this.probesFailed);

      // If probes failed equals the max probe failures allowed, the block completes, otherwise the participant retries the block
      if (this.probesFailed === this.probeFailuresAllotted) {
        this.failed();
      } else {
        this.retry();
      }
    } else {
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
      });
    this.reset();
  }
}
