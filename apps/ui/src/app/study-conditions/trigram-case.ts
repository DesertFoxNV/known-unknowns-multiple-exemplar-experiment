import { sample } from 'lodash-es';

export enum TrigramCase {
  lower = 'lower',
  upper = 'upper'
}

export const TRIGRAM_CASES: TrigramCase[] = Object.values(TrigramCase);

export function randomTrigramCase(): TrigramCase {
  const trigramCase = sample(TRIGRAM_CASES);
  if (trigramCase === undefined) throw Error('Random trigram case returned "undefined"!');
  return trigramCase;
}
