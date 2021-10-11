import { CueType } from '../study-conditions/cue';

export interface BalanceConfig {
  equalTo: number;
  greaterThan: number;
  iCannotKnow?: number;
  lessThan: number;
}

export interface StudyConfig {
  balance: BalanceConfig;
  contextualControl: boolean;
  cueType: CueType;
  iCannotKnow: boolean;
  participantId: string;
  trialTimeout: number; // in seconds
}

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
