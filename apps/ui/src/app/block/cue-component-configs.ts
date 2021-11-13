import * as Case from 'case';
import { shuffle } from 'lodash-es';
import {
  BUTTON_TEXT_FILE_PATH, CUE_NON_ARBITRARY_TO_FILENAME, CUE_TYPE, CueNonArbitrary, CUES_NON_ARBITRARY_W_ICK,
  CUES_NON_ARBITRARY_WO_ICK
} from '../study-conditions/cue.constants';
import { TrialCueComponentConfig } from '../study-conditions/trial-cue-component-config';
import { StudyConfig } from '../study-config-form/study-config';

/**
 * Generates the same studyConfig for all relation placements. Can be used in ick and non ick trials.
 * @param {StudyConfig} config
 * @param {CueNonArbitrary} cue
 * @returns {TrialCueComponentConfig[]}
 */
export function oneChoiceCueComponentConfig(config: StudyConfig, cue: CueNonArbitrary): TrialCueComponentConfig[] {
  return new Array(config.iCannotKnow ? 4 : 3).fill(undefined).map(() => ({
    isArbitrary: config.cueType === CUE_TYPE.arbitrary,
    fileName: config.cueType === CUE_TYPE.nonArbitrary ? BUTTON_TEXT_FILE_PATH : CUE_NON_ARBITRARY_TO_FILENAME[cue],
    value: cue,
    viewValue: Case.upper(cue)
  }));

}

/**
 * Generates two choices for all relation placements. Should only be used in ick trials.
 * @param {StudyConfig} config
 * @param {CueNonArbitrary} cue1
 * @param {CueNonArbitrary} cue2
 * @returns {TrialCueComponentConfig[]}
 */
export function twoChoiceCueComponentConfig(
  config: StudyConfig,
  cue1: CueNonArbitrary,
  cue2: CueNonArbitrary
): TrialCueComponentConfig[] {
  return shuffle(new Array(2).fill(undefined).map(() => ({
    isArbitrary: config.cueType === CUE_TYPE.arbitrary,
    fileName: config.cueType === CUE_TYPE.nonArbitrary ? BUTTON_TEXT_FILE_PATH : CUE_NON_ARBITRARY_TO_FILENAME[cue1],
    value: cue1,
    viewValue: Case.upper(cue1)
  })).concat(new Array(2).fill(undefined).map(() => ({
    isArbitrary: config.cueType === CUE_TYPE.arbitrary,
    fileName: config.cueType === CUE_TYPE.nonArbitrary ? BUTTON_TEXT_FILE_PATH : CUE_NON_ARBITRARY_TO_FILENAME[cue2],
    value: cue2,
    viewValue: Case.upper(cue2)
  }))));
}

/**
 * Generates two choices for all relation placements. Should only be used in ick trials.
 * @param {StudyConfig} config
 * @param stimulusCase
 * @returns {TrialCueComponentConfig[]}
 */
export function randomizedComponentConfigs(
  config: StudyConfig
): TrialCueComponentConfig[] {
  // Cue order is randomized
  const cues = shuffle(config.iCannotKnow ? CUES_NON_ARBITRARY_W_ICK : CUES_NON_ARBITRARY_WO_ICK);

  // Cue component configurations are mapped from relation order
  return cues.map((cue) => ({
    isArbitrary: config.cueType === CUE_TYPE.arbitrary,
    fileName: config.cueType === CUE_TYPE.nonArbitrary ? BUTTON_TEXT_FILE_PATH :
      CUE_NON_ARBITRARY_TO_FILENAME[cue],
    value: cue,
    viewValue: Case.upper(cue)
  }));
}
