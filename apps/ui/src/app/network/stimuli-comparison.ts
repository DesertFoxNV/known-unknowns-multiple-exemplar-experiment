import { CueNonArbitrary } from '../study-conditions/cue.constants';
import { StimuliComparisonTuple } from '../study-conditions/stimuli.interfaces';

/**
 * An interface for the stimuli comparison paired with the correct relation.
 * For example, if A = 'ABC' and B = 'BCD' and A = B the paired relation would be "SAME".
 */
export interface StimuliComparison {
  relation: CueNonArbitrary
  stimuli: StimuliComparisonTuple
}
