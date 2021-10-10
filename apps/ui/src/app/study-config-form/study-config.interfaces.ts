import { CueType } from '../study-conditions/cue';

export interface BalanceConfig {
  equalTo: number;
  greaterThan: number;
  idk?: number;
  lessThan: number;
}

export interface StudyConfig {
  balance: BalanceConfig;
  contextualControl: boolean;
  cueType: CueType;
  idk: boolean;
  participantId: string;
  trialTimeout: number; // in seconds
}

export interface StudyConfigFlattened {
  'balance.equalTo': number;
  'balance.greaterThan': number;
  'balance.idk'?: number;
  'balance.lessThan': number;
  cueType: CueType;
  contextualControl: boolean;
  idk: boolean;
  participantId: string;
  trialTimeout: number; // in seconds
}
