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
import { BlockComponent } from './block.component';
import { randomizedComponentConfigs } from './cue-component-configs';
import { TRIAL_DELAY_INTERVAL_MS } from './trial-animation-delay';

const gcd = (a: number, b: number): number => a ? gcd(b % a, a) : b;
const lcm = (a: number, b: number) => a * b / gcd(a, b);

export class OperantChoiceBlock extends Block {

  configBalanceDividedByGcd: Record<CueNonArbitrary, number>|undefined;
  containsSequentialTriplicates = false;
  correctCount: Record<CueNonArbitrary, number> = {
    different: 0,
    same: 0,
    greaterThan: 0,
    lessThan: 0,
    iCannotKnow: 0
  };
  correctShownTargets: Record<CueNonArbitrary, number>|undefined;
  graph: RelationalFrameGraph;
  index = -1;
  masterCriterion = {
    /**
     * Criteria 1
     *  1. Sequential correct > 35
     *  2. Comparison
     *    a. Non ICK - 6 same, 24 (greater or lesser than), 0 (i cannot know)
     *    b. ICK - 6 same, 24(greater or lesser than), 18 ( i cannot know)
     */
    // Path 1
    sequentialCorrectTarget: this.config.iCannotKnow ? 56 : 35,
    sequentialCorrectTargetAchieved: false,
    // Path 2
    comparisonTarget: 24, // greater than or less than
    iCannotKnowTarget: this.config.iCannotKnow ? 18 : 0,
    sameTarget: 6
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
    this.trials = this.createTrials();
  }

  get isComplete(): boolean {
    console.log('this.sequentialCorrect >= this.trials.length * 2 (alternative criterion)',
      this.sequentialCorrect >= this.trials.length * 2);
    console.log('this.meetsMasterCriterion1 && this.meetsMasterCriterion2',
      this.meetsMasterCriterion1 && this.meetsMasterCriterion2);
    (this.meetsMasterCriterion1 && this.meetsMasterCriterion2);
    return this.sequentialCorrect >= this.trials.length * 2 ||
      (this.meetsMasterCriterion1 && this.meetsMasterCriterion2);
  }

  get meetsMasterCriterion1(): boolean {
    const {
      sequentialCorrectTarget,
      sequentialCorrectTargetAchieved,
      comparisonTarget,
      iCannotKnowTarget,
      sameTarget
    } = this.masterCriterion;
    const { greaterThan, iCannotKnow, lessThan, same } = this.correctCount;
    if (this.sequentialCorrect ===
      sequentialCorrectTarget) this.masterCriterion.sequentialCorrectTargetAchieved = true;
    console.log(
      `Correctly sequentially completed ${sequentialCorrectTarget} trials during this block:`,
      sequentialCorrectTargetAchieved);
    console.log(
      `Same trials is gte than ${sameTarget}, comparison trials is gte than ${comparisonTarget}, and i cannot know trials is gte ${iCannotKnowTarget}: `,
      (same >= sameTarget && (greaterThan + lessThan >= comparisonTarget) && iCannotKnow === iCannotKnowTarget));
    return sequentialCorrectTargetAchieved ||
      (same >= sameTarget && (greaterThan + lessThan >= comparisonTarget) && iCannotKnow === iCannotKnowTarget);
  }

  get meetsMasterCriterion2(): boolean {
    if (!this.correctShownTargets) return false;
    return this.correctCount.same >= this.correctShownTargets.same &&
      this.correctCount.lessThan >= this.correctShownTargets.lessThan &&
      this.correctCount.greaterThan >= this.correctShownTargets.greaterThan &&
      this.correctCount.iCannotKnow >= this.correctShownTargets.iCannotKnow;
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

    graph.includeRelationsBetweenNetworks = config.iCannotKnow;

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

    const balanceGcd = Object.values(this.config.balance)
      .filter(b => b)
      .reduce(gcd);

    this.configBalanceDividedByGcd = {
      different: 0,
      same: this.config.balance.same / balanceGcd,
      greaterThan: this.config.balance.greaterThan / balanceGcd,
      lessThan: this.config.balance.lessThan / balanceGcd,
      iCannotKnow: this.config.balance?.iCannotKnow ? this.config.balance.iCannotKnow / balanceGcd : 0
    };

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

  grade(selected: CueSelected|undefined): 'CORRECT'|'WRONG'|null {
    const isCorrect = selected?.cue.value === this.trial.relation;

    if (selected?.cue.value === this.trial.relation) {
      this.correct++;
      this.sequentialCorrect++;
      this.correctCount[selected.cue.value]++;
    } else {
      this.sequentialCorrect = 0;
      this.incorrect++;
    }

    // generate shown targets based on balance
    if (this.meetsMasterCriterion1 && !this.correctShownTargets) {
      this.correctShownTargets = {
        different: 0,
        same: 0,
        greaterThan: 0,
        lessThan: 0,
        iCannotKnow: 0
      };
      while (this.correctShownTargets.same < this.correctCount.same ||
      this.correctShownTargets.greaterThan < this.correctCount.greaterThan ||
      this.correctShownTargets.lessThan < this.correctCount.lessThan ||
      this.correctShownTargets.iCannotKnow < this.correctCount.iCannotKnow) {
        if (this.configBalanceDividedByGcd) {
          this.correctShownTargets = {
            different: 0,
            same: this.correctShownTargets?.same + this.configBalanceDividedByGcd?.same,
            greaterThan: this.correctShownTargets?.greaterThan + this.configBalanceDividedByGcd?.greaterThan,
            lessThan: this.correctShownTargets?.lessThan + this.configBalanceDividedByGcd?.lessThan,
            iCannotKnow: this.correctShownTargets?.iCannotKnow + this.configBalanceDividedByGcd?.iCannotKnow
          };
        } else {
          throw Error('Config balance has not been created');
        }
      }
      console.log('Shown targets set to', this.correctShownTargets);
    }

    console.log('correct', this.correctCount);
    console.log('sequentialCorrect', this.sequentialCorrect);

    if (this.correctShownTargets && isCorrect && selected) {
      return this.correctCount[selected.cue.value] <= this.correctShownTargets[selected.cue.value] ? 'CORRECT' : null;
    } else {
      return isCorrect ? 'CORRECT' : 'WRONG';
    }
  }

  /**
   * Next trial overrides the base class so that the trial can be segmented
   * into two phases training and probe. If the participant fails a phase they
   * are allowed to retry up to the amount of failures allotted, otherwise
   * the study is completed.
   */
  nextTrial(): void {
    console.log('index', this.index);
    if (this.isComplete) {
      this.complete();
    } else {
      if (this.index == this.trials.length - 1) {
        this.component?.setVisibility(true);
        this.index = -1;
      }
      super.nextTrial();
    }
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
    this.index = -1;
    this.correct = 0;
    this.incorrect = 0;
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
    }, 2 * this.trials.length * (this.config.trialTimeoutSeconds * 1000 + FEEDBACK_DURATION_MS));
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

  /***
   * Resets block index, binds to the view, and shows a message.
   * @param {BlockComponent} component
   */
  start(component: BlockComponent) {
    this.component = component;
    component.prompt('CLICK TO START', false, TRIAL_DELAY_INTERVAL_MS)
      .subscribe(() => {
        this.setTimeout();
        this.nextTrial();
      });
  }
}
