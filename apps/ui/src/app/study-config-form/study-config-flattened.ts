import { CueType } from '../study-conditions/cue.constants';

export interface StudyConfigFlattened {
  'balance.equalTo': number;
  'balance.greaterThan': number;
  'balance.iCannotKnow'?: number;
  'balance.lessThan': number;
  cueType: CueType;
  contextualControl: boolean;
  iCannotKnow: boolean;
  participantId: string;
  trialTimeout: number; // in seconds
}
