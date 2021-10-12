import { CueNonArbitrary, CueTuple } from '../study-conditions/cue.constants';

type LessThanSameGreaterThanRecord<T> = Omit<Record<CueNonArbitrary, T>, CueNonArbitrary.iCannotKnow|CueNonArbitrary.different>

// Get cue for for the B to C comparison.
export const CUE_B_TO_C_COMPARISON: LessThanSameGreaterThanRecord<LessThanSameGreaterThanRecord<CueNonArbitrary>> =
  {
    [CueNonArbitrary.same]: {
      [CueNonArbitrary.same]: CueNonArbitrary.same,
      [CueNonArbitrary.greaterThan]: CueNonArbitrary.greaterThan,
      [CueNonArbitrary.lessThan]: CueNonArbitrary.lessThan
    },
    [CueNonArbitrary.lessThan]: {
      [CueNonArbitrary.same]: CueNonArbitrary.greaterThan,
      [CueNonArbitrary.greaterThan]: CueNonArbitrary.greaterThan,
      [CueNonArbitrary.lessThan]: CueNonArbitrary.iCannotKnow

    },
    [CueNonArbitrary.greaterThan]: {
      [CueNonArbitrary.same]: CueNonArbitrary.lessThan,
      [CueNonArbitrary.greaterThan]: CueNonArbitrary.iCannotKnow,
      [CueNonArbitrary.lessThan]: CueNonArbitrary.lessThan
    }
  };

export function getBToCComparisonCue(stimuli: CueTuple): CueNonArbitrary {
  const [B, C] = stimuli;
  return CUE_B_TO_C_COMPARISON[B][C];
}
