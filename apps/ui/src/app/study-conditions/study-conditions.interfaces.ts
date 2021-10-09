import { StudyConfig } from '../study-config-form/study-config.interfaces';
import { CueCase } from './cue-case';
import { CueType } from './cue';

export interface StudyConditions extends StudyConfig {
  cue: {
    case: CueCase,
    type: CueType,
  };
}
