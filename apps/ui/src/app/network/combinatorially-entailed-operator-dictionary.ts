import { CUE_NON_ARBITRARY, CueNonArbitrary, CueTuple } from '../study-conditions/cue.constants';

/**
 * A dictionary used to determine the combinatorially entailed operators for B to C and C to B.
 * WARNING: This can only be used for known and unknown networks.
 * @type {{[p: string]: {[p: string]: "SAME" | "GREATER THAN" | "LESS THAN", '[CUE_NON_ARBITRARY.same]': "SAME", '[CUE_NON_ARBITRARY.lessThan]': "LESS THAN", '[CUE_NON_ARBITRARY.greaterThan]': "GREATER THAN"} | {[p: string]: "GREATER THAN" | "I CANNOT KNOW", '[CUE_NON_ARBITRARY.same]': "GREATER THAN", '[CUE_NON_ARBITRARY.lessThan]': "I CANNOT KNOW", '[CUE_NON_ARBITRARY.greaterThan]': "GREATER THAN"} | {[p: string]: "LESS THAN" | "I CANNOT KNOW", '[CUE_NON_ARBITRARY.same]': "LESS THAN", '[CUE_NON_ARBITRARY.lessThan]': "LESS THAN", '[CUE_NON_ARBITRARY.greaterThan]': "I CANNOT KNOW"}, '[CUE_NON_ARBITRARY.same]': {[p: string]: "SAME" | "GREATER THAN" | "LESS THAN", '[CUE_NON_ARBITRARY.same]': "SAME", '[CUE_NON_ARBITRARY.lessThan]': "LESS THAN", '[CUE_NON_ARBITRARY.greaterThan]': "GREATER THAN"}, '[CUE_NON_ARBITRARY.lessThan]': {[p: string]: "GREATER THAN" | "I CANNOT KNOW", '[CUE_NON_ARBITRARY.same]': "GREATER THAN", '[CUE_NON_ARBITRARY.lessThan]': "I CANNOT KNOW", '[CUE_NON_ARBITRARY.greaterThan]': "GREATER THAN"}, '[CUE_NON_ARBITRARY.greaterThan]': {[p: string]: "LESS THAN" | "I CANNOT KNOW", '[CUE_NON_ARBITRARY.same]': "LESS THAN", '[CUE_NON_ARBITRARY.lessThan]': "LESS THAN", '[CUE_NON_ARBITRARY.greaterThan]': "I CANNOT KNOW"}}}
 */
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

/**
 * A function that wraps the combinatorially entailed operator dictionary to
 * type check the B and C stimuli, to ensure that they are not "DIFFERENT" or "I CANNOT KNOW".
 * If they match an invalid either of those an error is thrown.
 * @param {CueTuple<CueNonArbitrary>} stimuli
 * @returns {CueNonArbitrary}
 */
export function getCombinatorialOperatorForBToCCToB(stimuli: CueTuple<CueNonArbitrary>): CueNonArbitrary {
  const [B, C] = stimuli;
  if (B === 'I CANNOT KNOW' || B === 'DIFFERENT' || C === 'I CANNOT KNOW' || C === 'DIFFERENT')
    throw Error(`Stimuli B and C were "${stimuli.join(' and ')}", they cannot be "I CANNOT KNOW OR DIFFERENT"`);
  return COMBINATORIALLY_ENTAILED_OPERATOR_DICT[B][C];
}
