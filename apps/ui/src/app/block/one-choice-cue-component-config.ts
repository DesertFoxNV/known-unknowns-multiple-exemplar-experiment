import {
  BUTTON_TEXT_FILE_PATH,
  CUE_NON_ARBITRARY_TO_FILENAME,
  CUE_TYPE,
  CueNonArbitrary
} from '../study-conditions/cue.constants';
import { TrialCueComponentConfig } from '../study-conditions/trial-cue-component-config';
import {StudyConfig} from '../study-config-form/study-config';

export function oneChoiceCueComponentConfig(config: StudyConfig, cue: CueNonArbitrary): TrialCueComponentConfig[] {
  return new Array(config.iCannotKnow ? 4 : 3).fill(undefined).map(() => ({
    isArbitrary: config.cueType === CUE_TYPE.arbitrary,
    fileName: config.cueType === CUE_TYPE.nonArbitrary ? BUTTON_TEXT_FILE_PATH : CUE_NON_ARBITRARY_TO_FILENAME[cue],
    value: cue
  }));

}

export function twoChoiceCueComponentConfig(config: StudyConfig, cue1: CueNonArbitrary, cue2: CueNonArbitrary): TrialCueComponentConfig[] {
  return new Array(2).fill(undefined).map(() => ({
    isArbitrary: config.cueType === CUE_TYPE.arbitrary,
    fileName: config.cueType === CUE_TYPE.nonArbitrary ? BUTTON_TEXT_FILE_PATH : CUE_NON_ARBITRARY_TO_FILENAME[cue1],
    value: cue1
  })).concat(new Array(2).fill(undefined).map(() => ({
    isArbitrary: config.cueType === CUE_TYPE.arbitrary,
    fileName: config.cueType === CUE_TYPE.nonArbitrary ? BUTTON_TEXT_FILE_PATH : CUE_NON_ARBITRARY_TO_FILENAME[cue2],
    value: cue2
  })));
}
