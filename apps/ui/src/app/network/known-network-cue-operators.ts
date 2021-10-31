import { CUE_NON_ARBITRARY } from '../study-conditions/cue.constants';

/**
 * The first operator in the tuple is the A to B operator.
 * The second operator is the the A to C operator. Consider ['GREATER THAN', 'LESS THAN']
 * A > B, and A < C. Only the following relationships result in a fully specified
 * network that does no contain any unknowns.
 */
export type KnownNetworkAToBAToCOperators =
  ['SAME', 'SAME']|
  ['SAME', 'GREATER THAN']|
  ['SAME', 'LESS THAN']|
  ['LESS THAN', 'SAME']|
  ['LESS THAN', 'GREATER THAN']|
  ['GREATER THAN', 'SAME']|
  ['GREATER THAN', 'LESS THAN'];

/**
 * All of the know network cue operator options.
 * @type {(["SAME", "SAME"] | ["SAME", "GREATER THAN"] | ["SAME", "LESS THAN"] | ["LESS THAN", "SAME"] | ["LESS THAN", "GREATER THAN"] | ["GREATER THAN", "SAME"] | ["GREATER THAN", "LESS THAN"])[]}
 */
export const KNOWN_NETWORK_CUE_OPERATORS: KnownNetworkAToBAToCOperators[] = [
  [CUE_NON_ARBITRARY.same, CUE_NON_ARBITRARY.same],
  [CUE_NON_ARBITRARY.same, CUE_NON_ARBITRARY.greaterThan],
  [CUE_NON_ARBITRARY.same, CUE_NON_ARBITRARY.lessThan],
  [CUE_NON_ARBITRARY.lessThan, CUE_NON_ARBITRARY.same],
  [CUE_NON_ARBITRARY.lessThan, CUE_NON_ARBITRARY.greaterThan],
  [CUE_NON_ARBITRARY.greaterThan, CUE_NON_ARBITRARY.same],
  [CUE_NON_ARBITRARY.greaterThan, CUE_NON_ARBITRARY.lessThan]
];
