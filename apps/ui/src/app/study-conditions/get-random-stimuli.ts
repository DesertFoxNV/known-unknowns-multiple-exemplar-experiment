import { sample } from 'lodash-es';
import { OneHundredNonWordTrigramsFilteredByFrequency } from './one-hundred-non-word-trigrams-filtered-by-frequency';
import { StimulusCase } from './stimulus-case';

/***
 * Generates random stimuli and removes them from list to prevent duplicates
 * @param {number} num is integer
 * @param {StimulusCase} stimulusCase
 * @returns {string[]}
 */
export function getRandomStimuli(num: number, stimulusCase: StimulusCase): string[] {
  const stimuli: string[] = [];
  while (stimuli.length < num) {
    const stimulus: string|undefined = sample(OneHundredNonWordTrigramsFilteredByFrequency);
    if (stimulus === undefined) throw Error('Random value returned "undefined"!');
    const index = OneHundredNonWordTrigramsFilteredByFrequency.indexOf(stimulus);
    // It is important to remove each stimulus from list, so that it cannot be reused.
    if (index > -1) OneHundredNonWordTrigramsFilteredByFrequency.splice(index, 1);
    if (!stimuli.includes(stimulus)) stimuli.push(
      stimulusCase === StimulusCase.lower ? stimulus.toLowerCase() : stimulus.toUpperCase());
  }
  return stimuli;
}

