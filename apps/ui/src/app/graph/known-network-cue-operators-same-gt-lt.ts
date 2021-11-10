import { CUE_NON_ARBITRARY, CueNonArbitrary } from '../study-conditions/cue.constants';

export type TriNodeNetworkOperatorCombination<T> = [aToB: T|undefined, aToC: T|undefined, bToC: T|undefined]

/**
 * A list of operator combinations that result in a known network.
 * @type {(["same", "same", undefined] | ["same", "greaterThan", undefined] | ["same", "lessThan", undefined] | ["lessThan", "same", undefined] | ["lessThan", "lessThan", "lessThan"] | ["lessThan", "greaterThan", undefined] | ["greaterThan", "same", undefined] | ["greaterThan", "lessThan", undefined] | ["greaterThan", "greaterThan", "greaterThan"])[]}
 */
export const KNOWN_NETWORK_CUE_OPERATORS_SAME_GT_LT: TriNodeNetworkOperatorCombination<CueNonArbitrary>[] = [
  [CUE_NON_ARBITRARY.same, CUE_NON_ARBITRARY.same, undefined],
  [CUE_NON_ARBITRARY.same, CUE_NON_ARBITRARY.greaterThan, undefined],
  [CUE_NON_ARBITRARY.same, CUE_NON_ARBITRARY.lessThan, undefined],
  [CUE_NON_ARBITRARY.lessThan, CUE_NON_ARBITRARY.same, undefined],
  [CUE_NON_ARBITRARY.lessThan, undefined, CUE_NON_ARBITRARY.lessThan],
  [CUE_NON_ARBITRARY.lessThan, CUE_NON_ARBITRARY.greaterThan, undefined],
  [CUE_NON_ARBITRARY.greaterThan, CUE_NON_ARBITRARY.same, undefined],
  [CUE_NON_ARBITRARY.greaterThan, CUE_NON_ARBITRARY.lessThan, undefined],
  [CUE_NON_ARBITRARY.greaterThan, undefined, CUE_NON_ARBITRARY.greaterThan]
];
