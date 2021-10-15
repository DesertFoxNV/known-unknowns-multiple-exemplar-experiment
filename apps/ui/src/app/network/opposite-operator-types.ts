import { CUE_NON_ARBITRARY, CueNonArbitrary } from '../study-conditions/cue.constants';

export const MUTUALLY_ENTAILED_OPERATOR_DICT: Record<CueNonArbitrary, CueNonArbitrary> = {
  [CUE_NON_ARBITRARY.different]: CUE_NON_ARBITRARY.same,
  [CUE_NON_ARBITRARY.same]: CUE_NON_ARBITRARY.same,
  [CUE_NON_ARBITRARY.lessThan]: CUE_NON_ARBITRARY.greaterThan,
  [CUE_NON_ARBITRARY.greaterThan]: CUE_NON_ARBITRARY.lessThan,
  [CUE_NON_ARBITRARY.iCannotKnow]: CUE_NON_ARBITRARY.iCannotKnow
};
