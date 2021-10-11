import { shuffle } from 'lodash-es';
import { StudyConfig } from '../study-config-form/study-config.interfaces';
import {
  BUTTON_TEXT_FILE_PATH, CUES_ARBITRARY_FILE_PATHS, CUES_NON_ARBITRARY_W_ICK, CUES_NON_ARBITRARY_WO_ICK, CueType
} from './cue';
import { randomStimulusCase, StimulusCase } from './stimulus-case';
import { TrialCueComponentConfig } from './trial-cue-component-config';

export class StudyConditions {
  config: StudyConfig;
  cueComponentConfigs: TrialCueComponentConfig[];
  stimulusCase: StimulusCase;

  constructor(config: StudyConfig) {
    const stimulusCase = randomStimulusCase();
    const cueType = config.cueType;
    const cues = shuffle(config.iCannotKnow ? CUES_NON_ARBITRARY_W_ICK : CUES_NON_ARBITRARY_WO_ICK);
    const arbitraryFileNames = shuffle(CUES_ARBITRARY_FILE_PATHS);

    this.config = config;
    this.cueComponentConfigs = cues.map((cue, i) => ({
      isArbitrary: config.cueType === CueType.arbitrary,
      fileName: cueType === CueType.nonArbitrary ? BUTTON_TEXT_FILE_PATH : arbitraryFileNames[i],
      value: cue
    }));
    this.stimulusCase = stimulusCase;
  }
}