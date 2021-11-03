import { CUE_NON_ARBITRARY } from '../study-conditions/cue.constants';

/**
 * The first operator in the tuple is the A to B operator.
 * The second operator is the the A to C operator. Consider ['GREATER THAN', 'LESS THAN']
 * A > B, and A < C. Only the following relationships result in a fully specified
 * network that does no contain any unknowns.
 */
export type UnknownNetworkAToBAToCOperators =
  ['LESS THAN', 'LESS THAN']|
  ['GREATER THAN', 'GREATER THAN'];

/**
 * All of the unknown network relation operator options.
 * @type {(["SAME", "SAME"] | ["SAME", "GREATER THAN"] | ["SAME", "LESS THAN"] | ["LESS THAN", "SAME"] | ["LESS THAN", "GREATER THAN"] | ["GREATER THAN", "SAME"] | ["GREATER THAN", "LESS THAN"])[]}
 */
export const UNKNOWN_NETWORK_CUE_OPERATORS: UnknownNetworkAToBAToCOperators[] = [
  [CUE_NON_ARBITRARY.lessThan, CUE_NON_ARBITRARY.lessThan],
  [CUE_NON_ARBITRARY.greaterThan, CUE_NON_ARBITRARY.greaterThan]
];
