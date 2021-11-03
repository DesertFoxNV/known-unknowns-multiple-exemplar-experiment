import { CUE_NON_ARBITRARY, CueNonArbitrary } from '../study-conditions/cue.constants';
import { TriNodeNetworkOperatorCombination } from './known-network-cue-operators-same-gt-lt';

/**
 * List of operator combinations that results in an unknown network.
 * @type {(["lessThan", "lessThan", undefined] | ["greaterThan", "greaterThan", undefined])[]}
 */
export const UNKNOWN_NETWORK_CUE_OPERATORS_SAME_GT_LT: TriNodeNetworkOperatorCombination<CueNonArbitrary>[] = [
  [CUE_NON_ARBITRARY.lessThan, CUE_NON_ARBITRARY.lessThan, undefined],
  [CUE_NON_ARBITRARY.greaterThan, CUE_NON_ARBITRARY.greaterThan, undefined]
];
