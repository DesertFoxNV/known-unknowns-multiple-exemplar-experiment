import { CUE_NON_ARBITRARY, CueNonArbitrary, CueTuple } from '../study-conditions/cue.constants';

export const COMBINATORIALLY_ENTAILED_OPERATOR_DICT: Record<'SAME'|'LESS THAN'|'GREATER THAN', Record<'SAME'|'LESS THAN'|'GREATER THAN', CueNonArbitrary>> =
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

export function getCombinatorialOperatorForBToC(stimuli: CueTuple<CueNonArbitrary>): CueNonArbitrary {
  const [B, C] = stimuli;
  if (B === 'I CANNOT KNOW' || B === 'DIFFERENT' || C === 'I CANNOT KNOW' || C === 'DIFFERENT')
    throw Error(`Stimuli B and C were "${stimuli.join(' and ')}", they cannot be "I CANNOT KNOW OR DIFFERENT"`);
  return COMBINATORIALLY_ENTAILED_OPERATOR_DICT[B][C];
}
