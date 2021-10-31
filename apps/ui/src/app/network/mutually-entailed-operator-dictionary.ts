import { CUE_NON_ARBITRARY, CueNonArbitrary } from '../study-conditions/cue.constants';

/**
 * A dictionary used to determine the mutually entailed operators for B to A and C to A.
 * WARNING: This can only be used for known and unknown networks.
 * @type {{[p: string]: "SAME" | "GREATER THAN" | "LESS THAN" | "I CANNOT KNOW", '[CUE_NON_ARBITRARY.same]': "SAME", '[CUE_NON_ARBITRARY.iCannotKnow]': "I CANNOT KNOW", '[CUE_NON_ARBITRARY.different]': "SAME", '[CUE_NON_ARBITRARY.lessThan]': "GREATER THAN", '[CUE_NON_ARBITRARY.greaterThan]': "LESS THAN"}}
 */
export const MUTUALLY_ENTAILED_OPERATOR_DICT: Record<CueNonArbitrary, CueNonArbitrary> = {
  [CUE_NON_ARBITRARY.different]: CUE_NON_ARBITRARY.same,
  [CUE_NON_ARBITRARY.same]: CUE_NON_ARBITRARY.same,
  [CUE_NON_ARBITRARY.lessThan]: CUE_NON_ARBITRARY.greaterThan,
  [CUE_NON_ARBITRARY.greaterThan]: CUE_NON_ARBITRARY.lessThan,
  [CUE_NON_ARBITRARY.iCannotKnow]: CUE_NON_ARBITRARY.iCannotKnow
};
