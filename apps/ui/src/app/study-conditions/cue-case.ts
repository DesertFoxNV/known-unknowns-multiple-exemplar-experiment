import { sample } from 'lodash-es';

export interface TrialButtonConfig {
  cue: string,
  fileName: string,
}

export enum CueCase {
  lower = 'lower',
  upper = 'upper'
}

export const CUE_CASES: CueCase[] = Object.values(CueCase);

export function randomTrigramCase(): CueCase {
  const cueCase = sample(CUE_CASES);
  if (cueCase === undefined) throw Error('Random trigram case returned "undefined"!');
  return cueCase;
}
