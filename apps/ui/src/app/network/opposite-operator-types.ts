import { CueNonArbitrary } from '../study-conditions/cue.constants';

export const OPPOSITE_OPERATOR_TYPES: Record<CueNonArbitrary, CueNonArbitrary> = {
  [CueNonArbitrary.different]: CueNonArbitrary.same,
  [CueNonArbitrary.same]: CueNonArbitrary.same,
  [CueNonArbitrary.lessThan]: CueNonArbitrary.greaterThan,
  [CueNonArbitrary.greaterThan]: CueNonArbitrary.lessThan,
  [CueNonArbitrary.iCannotKnow]: CueNonArbitrary.iCannotKnow
};
