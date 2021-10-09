import { StudyConfig } from '../study-config-form/study-config.interfaces';
import { TrigramCase } from './trigram-case';
import { RelationCueType } from './relation-cue-type';

export interface StudyConditions extends StudyConfig {
  relationalCueType: RelationCueType;
  trigramCase: TrigramCase;
}
