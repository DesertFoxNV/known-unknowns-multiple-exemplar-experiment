import { isEqual, shuffle } from 'lodash-es';
import {
  COMBINATORIALLY_ENTAILED_DICTIONARY_SAME_GT_LT_ICK, MUTUALLY_ENTAILED_DICTIONARY_SAME_GT_LT_ICK
} from '../graph/operator-dictionaries';
import { RelationType } from '../graph/relation-type';
import { RelationalEdge } from '../graph/relational-edge';
import { RelationalFrameGraph } from '../graph/relational-frame-graph';
import { RelationalNode } from '../graph/relational-node';
import { StimuliComparison } from '../graph/stimuli-comparison';
import { CueNonArbitrary, CUES_NON_ARBITRARY_W_ICK } from '../study-conditions/cue.constants';
import { getRandomStimulus } from '../study-conditions/get-random-stimuli';
import { StudyConfigWCase } from '../study-config-form/study-config';
import { CueSelected } from '../trial/cue-selected';
import { FADE_OUT_DURATION_MS } from '../trial/fade-out-duration';
import { Trial } from '../trial/trial';
import { FEEDBACK_DURATION_MS, FEEDBACK_FADE_OUT_DELAY_MS } from '../trial/trial-correct/feedback-duration';
import { Block } from './block';
import { randomizedComponentConfigs } from './cue-component-configs';
import { TRIAL_DELAY_INTERVAL_MS } from './trial-animation-delay';

const gcd = (a: number, b: number): number => a ? gcd(b % a, a) : b;
const lcm = (a: number, b: number) => a * b / gcd(a, b);

export class OperantChoiceBlock extends Block {
  containsSequentialTriplicates = false;
  correctCount: Record<CueNonArbitrary, number> = {
    different: 0,
    same: 0,
    greaterThan: 0,
    lessThan: 0,
    iCannotKnow: 0
  };
  graph: RelationalFrameGraph;
  incorrectCount: Record<CueNonArbitrary, number> = {
    different: 0,
    same: 0,
    greaterThan: 0,
    lessThan: 0,
    iCannotKnow: 0
  };
  maxShuffles = 2500;
  numAllottedTimeouts = 1;
  numTimeouts = 0;
  sequentialCorrect = 0;
  stimuliComparisonCopies = 2;
  timeout?: NodeJS.Timeout;

  constructor(
    config: StudyConfigWCase
  ) {
    super('Operant Choice', config);
    this.graph = this.createGraph(config);
  }

  get isComplete(): boolean {
    return this.sequentialCorrect >= this.trials.length * 2;
  }

  complete() {
    if (this.timeout) clearTimeout(this.timeout);
    super.complete();
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
      MUTUALLY_ENTAILED_DICTIONARY_SAME_GT_LT_ICK,
      COMBINATORIALLY_ENTAILED_DICTIONARY_SAME_GT_LT_ICK);

    graph.includeRelationsBetweenNetworks = true;

    // Network 1 - known network
    const nodeA1 = new RelationalNode('A', 1, getRandomStimulus(config.stimulusCase));
    const nodeB1 = new RelationalNode('B', 1, getRandomStimulus(config.stimulusCase));
    const nodeC1 = new RelationalNode('C', 1, getRandomStimulus(config.stimulusCase));

    // Add nodes for network 1
    graph.addNode(nodeA1);
    graph.addNode(nodeB1);
    graph.addNode(nodeC1);

    // Set A1 = B1 = C1
    graph.addTrainedAndMutualRelations(new RelationalEdge(nodeA1, nodeB1, 'same', RelationType.trained));
    graph.addTrainedAndMutualRelations(new RelationalEdge(nodeA1, nodeC1, 'same', RelationType.trained));
    graph.addTrainedAndMutualRelations(new RelationalEdge(nodeB1, nodeC1, 'same', RelationType.trained));

    // Network 2 - A2 > B2 > C2
    const nodeA2 = new RelationalNode('A', 2, getRandomStimulus(config.stimulusCase));
    const nodeB2 = new RelationalNode('B', 2, getRandomStimulus(config.stimulusCase));
    const nodeC2 = new RelationalNode('C', 2, getRandomStimulus(config.stimulusCase));

    // Add nodes for network 2
    graph.addNode(nodeA2);
    graph.addNode(nodeB2);
    graph.addNode(nodeC2);

    // Set A2 > B2 > C2
    graph.addTrainedAndMutualRelations(new RelationalEdge(nodeA2, nodeB2, 'greaterThan', RelationType.trained));
    graph.addTrainedAndMutualRelations(new RelationalEdge(nodeA2, nodeC2, 'greaterThan', RelationType.trained));
    graph.addTrainedAndMutualRelations(new RelationalEdge(nodeB2, nodeC2, 'greaterThan', RelationType.trained));

    console.log(graph.toString());

    return graph;
  }

  /**
   * Creates trials.
   * @returns {unknown[] | Array<Trial[][keyof Trial[]]>}
   */
  createTrials() {

    // pool network comparisons
    const comparisons: StimuliComparison<RelationalNode>[] = [
      this.graph.trained,
      this.graph.mutuallyEntailed
    ].flat().concat(this.config.iCannotKnow ? this.graph.combinatoriallyEntailed : []);

    // creates a record of relation type to unique stimuli comparisons
    const cueByStimuli = CUES_NON_ARBITRARY_W_ICK.reduce(
      (acc, cue) => ({ ...acc, [cue]: comparisons.filter(comparison => comparison.relation === cue) }),
      {} as Record<CueNonArbitrary, StimuliComparison<RelationalNode>[]>);

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
      different: 0,
      same: this.config.balance.same / balanceGcd,
      greaterThan: this.config.balance.greaterThan / balanceGcd,
      lessThan: this.config.balance.lessThan / balanceGcd,
      iCannotKnow: this.config.balance?.iCannotKnow ? this.config.balance.iCannotKnow / balanceGcd : 0
    };

    console.log('balance', configBalanceDividedByGcd);

    const balanceTimesMultiplier: Record<CueNonArbitrary, number> = {
      different: 0,
      same: (this.config.balance.same * cueMultiplierByStimuli.same),
      greaterThan: (this.config.balance.greaterThan * cueMultiplierByStimuli.greaterThan),
      lessThan: (this.config.balance.lessThan * cueMultiplierByStimuli.lessThan),
      iCannotKnow: this.config.balance?.iCannotKnow ?
        (this.config.balance.iCannotKnow * cueMultiplierByStimuli.iCannotKnow) : 0
    };

    const multiplierGcd = Object.values(balanceTimesMultiplier)
      .filter(b => b)
      .reduce(gcd);

    for (const cue of CUES_NON_ARBITRARY_W_ICK) {
      if (cueCountsByStimuli[cue] === 0) continue;
      const numberOfTrials = balanceTimesMultiplier[cue] / multiplierGcd * this.stimuliComparisonCopies;

      for (let i = 0; i < numberOfTrials; i++) {
        this.trials = this.trials.concat(
          cueByStimuli[cue].flat().map(stimuliComparison => ({
            ...stimuliComparison,
            cueComponentConfigs: randomizedComponentConfigs(this.config)
          })));
      }
    }
    this.shuffleUntilNoTriplicatesInARow();

    console.log(this.trials.length);

    return this.trials;
  }

  /**
   * Participants that fail the block criterion are thanked for their participation and the study is completed.
   */
  failed() {
    this.component?.setVisibility(false);
    this.component?.prompt('THANKS FOR PARTICIPATING', true, TRIAL_DELAY_INTERVAL_MS +
      (this.feedBackShown ? FEEDBACK_FADE_OUT_DELAY_MS : FADE_OUT_DURATION_MS)).subscribe();
  }

  /**
   * Feedback is enabled in the operant choice block.
   * @returns {boolean}
   */
  feedbackEnabled(): boolean {
    return true;
  }

  grade(selected: CueSelected|undefined): 'CORRECT'|'WRONG' {
    const isCorrect = selected?.cue.value === this.trial.relation;

    if (selected?.cue.value === this.trial.relation) {
      this.correct++;
      this.sequentialCorrect++;
      this.correctCount[selected.cue.value]++;
    } else {
      this.sequentialCorrect = 0;
      this.incorrect++;
      if (selected?.cue.value) this.incorrectCount[selected.cue.value]++;
    }
    console.log('correct', this.correctCount);
    console.log('incorrect', this.incorrectCount);
    console.log('sequentialCorrect', this.sequentialCorrect);
    console.log('correctPercentage', this.percentCorrect);

    return isCorrect ? 'CORRECT' : 'WRONG';
  }

  /**
   * Next trial overrides the base class so that the trail can be segmented
   * into two phases training and probe. If the participant fails a phase they
   * are allowed to retry up to the amount of failures allotted, otherwise
   * the study is completed.
   */
  nextTrial(): void {
    // set timer for trial timeout
    if (this.trialNum === 0) {
      if (this.timeout) clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.numTimeouts++;
        if (this.numTimeouts > this.numAllottedTimeouts) {
          this.failed();
        } else {
          this.retry();
        }
      }, 2 * this.trials.length * (this.config.trialTimeoutSeconds * 1000 + FEEDBACK_DURATION_MS));
    }

    // if (this.trialNum === this.numTrainingTrials && this.percentCorrect !== 100) {
    //   this.trainingsFailed++;
    //   console.log('training failed', this.trialNum);
    //   console.log('trainingsFailed', this.trainingsFailed);
    //
    //   // If trainings failed equals the max training failures allowed, the block completes, otherwise the participant retries the block
    //   if (this.trainingsFailed === this.trainingFailuresAllotted) {
    //     this.failed();
    //   } else {
    //     this.retry();
    //   }
    //
    // } else if (this.trialNum === this.numProbeTrials + this.numTrainingTrials && this.percentCorrect !== 100) {
    //   this.probesFailed++;
    //   console.log('training failed', this.trialNum);
    //   console.log('probesFailed', this.probesFailed);
    //
    //   // If probes failed equals the max probe failures allowed, the block completes, otherwise the participant retries the block
    //   if (this.probesFailed === this.probeFailuresAllotted) {
    //     this.failed();
    //   } else {
    //     this.retry();
    //   }
    super.nextTrial();
  }

  /***
   * Resets block index, correct count, incorrect count, and generates fresh trials.
   */
  reset() {
    this.correctCount = {
      different: 0,
      same: 0,
      greaterThan: 0,
      lessThan: 0,
      iCannotKnow: 0
    };
    this.incorrectCount = {
      different: 0,
      same: 0,
      greaterThan: 0,
      lessThan: 0,
      iCannotKnow: 0
    };
    super.reset();
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

  /**
   * Shuffles deck until either no triplicates are found or number of shuffles exceeds maxShuffles
   */
  shuffleUntilNoTriplicatesInARow() {
    let cachedTrial: Trial|undefined = undefined;
    let countsInARow = 0;

    for (let i = 0; i < this.maxShuffles; i++) {
      this.trials = shuffle(this.trials);

      for (const trial of this.trials) {

        if (!isEqual(trial.stimuli, cachedTrial?.stimuli)) {
          cachedTrial = trial;
          countsInARow = 0;
        } else {
          countsInARow++;
        }

        if (countsInARow === 3) break;
      }

      if (countsInARow) break;
    }

    if (countsInARow >= 3) this.containsSequentialTriplicates = true;

  }
}
