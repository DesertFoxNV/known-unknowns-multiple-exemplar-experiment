import { sample } from 'lodash-es';

export enum StimulusCase {
  lower = 'lower',
  upper = 'upper'
}

export const STIMULUS_CASES: StimulusCase[] = Object.values(StimulusCase);

export function randomStimulusCase(): StimulusCase {
  const stimulusCase = sample(STIMULUS_CASES);
  if (stimulusCase === undefined) throw Error('Random stimulus case returned "undefined"!');
  return stimulusCase;
}
