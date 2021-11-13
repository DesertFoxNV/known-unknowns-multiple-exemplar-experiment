import { sample } from 'lodash-es';
import { OneHundredNonWordTrigramsFilteredByFrequency } from './one-hundred-non-word-trigrams-filtered-by-frequency';
import { STIMULUS_CASE, StimulusCase } from './stimulus-case';

/***
 * Generates random stimulus and removes them from list to prevent duplicates
 * @param {StimulusCase} stimulusCase
 * @returns {string}
 */
export function getRandomStimulus(stimulusCase: StimulusCase): string {
  const stimulus: string|undefined = sample(OneHundredNonWordTrigramsFilteredByFrequency);
  if (stimulus === undefined) throw Error('Random value returned "undefined"!');
  const index = OneHundredNonWordTrigramsFilteredByFrequency.indexOf(stimulus);
  // It is important to remove each stimulus from list, so that it cannot be reused.
  if (index > -1) OneHundredNonWordTrigramsFilteredByFrequency.splice(index, 1);
  return stimulusCase === STIMULUS_CASE.lower ? stimulus.toLowerCase() : stimulus.toUpperCase();
}

