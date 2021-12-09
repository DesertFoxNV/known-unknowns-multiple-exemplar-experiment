import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { isEqual, shuffle } from 'lodash-es';
import { Network5And6Graph } from '../../graph/network-5-and-6-graph';
import { RelationalNode } from '../../graph/relational-node';
import { StimuliComparison } from '../../graph/stimuli-comparison';
import { OverlayService } from '../../overlay/overlay.service';
import { ReportService } from '../../report/report.service';
import { CueNonArbitrary, CUES_NON_ARBITRARY_W_ICK } from '../../study-conditions/cue.constants';
import { Trial } from '../../trial/trial';
import { FEEDBACK_DURATION_MS } from '../../trial/trial-correct/feedback-duration';
import { TrialCounterService } from '../../trial/trial-counter.service';
import { TrialCompleted } from '../../trial/trial.component';
import { BlockComponent } from '../block.component';
import { randomizedComponentConfigs } from '../cue-component-configs';
import { TRIAL_DELAY_INTERVAL_MS } from '../trial-animation-delay';

const gcd = (a: number, b: number): number => a ? gcd(b % a, a) : b;
const lcm = (a: number, b: number) => a * b / gcd(a, b);

@Component({
  selector: 'operant-choice-block',
  templateUrl: './operant-choice-block.component.html',
  styleUrls: ['./operant-choice-block.component.scss'],
  animations: []
})
export class OperantChoiceBlockComponent extends BlockComponent implements OnInit, OnDestroy {
  configBalanceDividedByGcd: Record<CueNonArbitrary, number>|undefined;
  correctCount: Record<CueNonArbitrary|'red'|'green'|'blue', number> = {
    different: 0,
    same: 0,
    greaterThan: 0,
    lessThan: 0,
    iCannotKnow: 0,
    red: 0,
    green: 0,
    blue: 0
  };
  correctShownTargets: Record<CueNonArbitrary, number>|undefined;
  index = -1;
  maxShuffles = 2500;
  name = 'Operant Choice';
  numAllottedTimeouts = 1;
  numTimeouts = 0;
  stimuliComparisonCopies = 2;
  timeout?: NodeJS.Timeout;

  constructor(
    dialog: MatDialog,
    overlaySvc: OverlayService,
    reportSvc: ReportService,
    trialCounterSvc: TrialCounterService,
    private network5And6Graph: Network5And6Graph
  ) {
    super(dialog, overlaySvc, reportSvc, trialCounterSvc);
  }

  get isComplete(): boolean {
    return this.sequentialCorrect >= this.trials.length * 2 ||
      (this.meetsMasterCriterion1 && this.meetsMasterCriterion2);
  }

  get masterCriterion() {
    if (!this.studyConfig) throw Error('Study configuration is undefined');
    return {
      /**
       * Criteria 1
       *  1. Sequential correct > 35
       *  2. Comparison
       *    a. Non ICK - 6 same, 24 (greater or lesser than), 0 (i cannot know)
       *    b. ICK - 6 same, 24(greater or lesser than), 18 ( i cannot know)
       */
      // Path 1
      sequentialCorrectTarget: this.studyConfig.iCannotKnow ? 56 : 35,
      sequentialCorrectTargetAchieved: false,
      // Path 2
      comparisonTarget: 24, // greater than or less than
      iCannotKnowTarget: this.studyConfig.iCannotKnow ? 18 : 0,
      sameTarget: 6
    };
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
    return sequentialCorrectTargetAchieved ||
      (same >= sameTarget && (greaterThan + lessThan >= comparisonTarget) && iCannotKnow >= iCannotKnowTarget);
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
   * Creates trials.
   * @returns {unknown[] | Array<Trial[][keyof Trial[]]>}
   */
  createTrials() {
    const { studyConfig } = this; // defined locally so typescript can infer types
    if (!studyConfig) throw Error('Study configuration is undefined');

    this.network5And6Graph.includeRelationsBetweenNetworks = studyConfig.iCannotKnow;

    // pool network comparisons
    const comparisons: StimuliComparison<RelationalNode>[] = [
      this.network5And6Graph.trained,
      this.network5And6Graph.mutuallyEntailed
    ].flat().concat(studyConfig.iCannotKnow ? this.network5And6Graph.combinatoriallyEntailed : []);

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

    const balanceGcd = Object.values(studyConfig.balance)
      .filter(b => b)
      .reduce(gcd);

    this.configBalanceDividedByGcd = {
      different: 0,
      same: studyConfig.balance.same / balanceGcd,
      greaterThan: studyConfig.balance.greaterThan / balanceGcd,
      lessThan: studyConfig.balance.lessThan / balanceGcd,
      iCannotKnow: studyConfig.balance?.iCannotKnow ? studyConfig.balance.iCannotKnow / balanceGcd : 0
    };

    const balanceTimesMultiplier: Record<CueNonArbitrary, number> = {
      different: 0,
      same: (studyConfig.balance.same * cueMultiplierByStimuli.same),
      greaterThan: (studyConfig.balance.greaterThan * cueMultiplierByStimuli.greaterThan),
      lessThan: (studyConfig.balance.lessThan * cueMultiplierByStimuli.lessThan),
      iCannotKnow: studyConfig.balance?.iCannotKnow ?
        (studyConfig.balance.iCannotKnow * cueMultiplierByStimuli.iCannotKnow) : 0
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
            cueComponentConfigs: randomizedComponentConfigs(studyConfig)
          })));
      }
    }
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

  grade(selected: TrialCompleted) {
    if (!this.trial) throw Error('Trial is undefined');
    const isCorrect = selected?.cue?.value === this.trial.relation;

    if (selected?.cue?.value === this.trial.relation) {
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
    }

    if (this.correctShownTargets && isCorrect && selected?.cue &&
      !['red', 'green', 'blue'].includes(selected.cue.value)) {
      return this.correctCount[selected.cue.value] <= this.correctShownTargets[selected.cue.value] ? 'CORRECT' :
        undefined;
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
    if (this.isComplete) {
      this.complete();
    } else {
      if (this.index == this.trials.length - 1) {
        this.index = -1;
      }
      super.nextTrial();
    }
  }

  ngOnDestroy(): void {
    if (this.timeout) clearTimeout(this.timeout);
  }

  ngOnInit(): void {
    this.createTrials();
    this.start();
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
      iCannotKnow: 0,
      red: 0,
      green: 0,
      blue: 0
    };
    this.index = -1;
    this.correct = 0;
    this.incorrect = 0;
    this.setTimeout();
  }

  setTimeout() {
    if (!this.studyConfig) throw Error('Study configuration is undefined');
    if (this.timeout) clearTimeout(this.timeout);
    this.failSafeDuration = 2 * this.trials.length *
      (this.studyConfig.trialTimeoutSeconds * 1000 + FEEDBACK_DURATION_MS);
    this.timeout = setTimeout(() => {
      this.trialComponent?.clearTimer();
      this.numTimeouts++;
      if (this.numTimeouts > this.numAllottedTimeouts) {
        this.failed();
      } else {
        this.retry();
      }
    }, this.failSafeDuration);
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
  start() {
    this.prompt(this.startInstructions, false, TRIAL_DELAY_INTERVAL_MS)
      .subscribe(() => {
        this.nextTrial();
      });
  }
}
