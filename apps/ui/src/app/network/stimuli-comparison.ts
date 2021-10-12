import { CueNonArbitrary } from '../study-conditions/cue.constants';
import { StimuliComparisonTuple } from '../study-conditions/stimuli.interfaces';

export interface StimuliComparison {
  cue: CueNonArbitrary
  stimuli: StimuliComparisonTuple,
}
