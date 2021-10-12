import { sample } from 'lodash-es';
import { STIMULUS_CASES, StimulusCase } from './stimulus-case';

export function randomStimulusCase(): StimulusCase {
  const stimulusCase = sample(STIMULUS_CASES);
  if (stimulusCase === undefined) throw Error('Random stimulus case returned "undefined"!');
  return stimulusCase;
}
