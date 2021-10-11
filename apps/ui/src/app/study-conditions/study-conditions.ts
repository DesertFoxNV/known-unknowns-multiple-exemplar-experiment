import { shuffle } from 'lodash-es';
import { StudyConfig } from '../study-config-form/study-config.interfaces';
import {
  BUTTON_TEXT_FILE_PATH, CUES_ARBITRARY_FILE_PATHS, CUES_NON_ARBITRARY_W_ICK, CUES_NON_ARBITRARY_WO_ICK, CueType
} from './cue';
import { CueCase, randomTrigramCase, TrialButtonConfig } from './cue-case';
import { getRandomCues } from './get-random-cue';

export class StudyConditions {
  config: StudyConfig;
  cues: {
    case: CueCase,
    buttons: TrialButtonConfig[],
    type: CueType,
    options: string[]
  };

  constructor(config: StudyConfig) {
    const cueCase = randomTrigramCase();
    const cueType = config.cueType;
    const buttonCues = shuffle(config.iCannotKnow ? CUES_NON_ARBITRARY_W_ICK : CUES_NON_ARBITRARY_WO_ICK);
    const arbitraryFileNames = shuffle(CUES_ARBITRARY_FILE_PATHS);

    this.config = config;
    this.cues = {
      buttons: buttonCues.map((cue, i) => ({
        cue,
        fileName: cueType === CueType.nonArbitrary ? BUTTON_TEXT_FILE_PATH : arbitraryFileNames[i]
      })),
      case: cueCase,
      type: cueType,
      options: getRandomCues(50, cueCase)
    };
  }
}
