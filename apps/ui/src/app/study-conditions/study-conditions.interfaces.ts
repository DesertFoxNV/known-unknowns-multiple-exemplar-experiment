import { StudyConfig } from '../study-config-form/study-config.interfaces';
import { StimulusCase } from './stimulus-case';
import { CueType } from './cue';

export interface StudyConditions extends StudyConfig {
  cue: {
    case: StimulusCase,
    type: CueType,
  };
}
