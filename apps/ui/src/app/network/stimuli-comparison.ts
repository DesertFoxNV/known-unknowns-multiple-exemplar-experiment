import { CueNonArbitrary } from '../study-conditions/cue.constants';
import { StimuliComparisonTuple } from '../study-conditions/stimuli.interfaces';

/**
 * An interface for the stimuli comparison paired with the correct cue.
 * For example, if A = 'ABC' and B = 'BCD' and A = B the paired cue would be "SAME".
 */
export interface StimuliComparison {
  cue: CueNonArbitrary
  stimuli: StimuliComparisonTuple,
}
