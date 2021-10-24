import {
  BUTTON_TEXT_FILE_PATH,
  CUE_NON_ARBITRARY_TO_FILENAME,
  CUE_TYPE,
  CueNonArbitrary
} from '../study-conditions/cue.constants';
import {StudyConfig} from '../study-config-form/study-config';

export function createComponentConfig(config: StudyConfig, cue: CueNonArbitrary) {
  return new Array(4).fill(undefined).map(() => ({
    isArbitrary: config.cueType === CUE_TYPE.arbitrary,
    fileName: config.cueType === CUE_TYPE.nonArbitrary ? BUTTON_TEXT_FILE_PATH : CUE_NON_ARBITRARY_TO_FILENAME[cue],
    value: cue
  }));
}
