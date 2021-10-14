import { CUE_NON_ARBITRARY, CueNonArbitrary, CueNonArbitraryExact, CueTuple } from '../study-conditions/cue.constants';

// Get cue for for the B to C comparison.
export const CUE_B_TO_C_COMPARISON: Record<CueNonArbitraryExact, Record<CueNonArbitraryExact, CueNonArbitrary>> =
  {
    [CUE_NON_ARBITRARY.same]: {
      [CUE_NON_ARBITRARY.same]: CUE_NON_ARBITRARY.same,
      [CUE_NON_ARBITRARY.greaterThan]: CUE_NON_ARBITRARY.greaterThan,
      [CUE_NON_ARBITRARY.lessThan]: CUE_NON_ARBITRARY.lessThan
    },
    [CUE_NON_ARBITRARY.lessThan]: {
      [CUE_NON_ARBITRARY.same]: CUE_NON_ARBITRARY.greaterThan,
      [CUE_NON_ARBITRARY.greaterThan]: CUE_NON_ARBITRARY.greaterThan,
      [CUE_NON_ARBITRARY.lessThan]: CUE_NON_ARBITRARY.iCannotKnow
    },
    [CUE_NON_ARBITRARY.greaterThan]: {
      [CUE_NON_ARBITRARY.same]: CUE_NON_ARBITRARY.lessThan,
      [CUE_NON_ARBITRARY.greaterThan]: CUE_NON_ARBITRARY.iCannotKnow,
      [CUE_NON_ARBITRARY.lessThan]: CUE_NON_ARBITRARY.lessThan
    }
  };

export function getBToCComparisonCue(stimuli: CueTuple): CueNonArbitrary {
  const [B, C] = stimuli;
  return CUE_B_TO_C_COMPARISON[B][C];
}
