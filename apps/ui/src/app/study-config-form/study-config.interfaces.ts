export interface BalanceConfig {
  equalTo: number;
  greaterThan: number;
  idk?: number;
  lessThan: number;
}

export interface StudyConfig {
  balance: BalanceConfig;
  contextualControl: boolean;
  idk: boolean;
  participantId: string;
  trialTimeout: number; // in seconds
}

export interface StudyConfigParams {
  'balance.equalTo': string;
  'balance.greaterThan': string;
  'balance.idk'?: string;
  'balance.lessThan': string;
  contextualControl: string;
  idk: string;
  participantId: string;
  trialTimeout: string; // in seconds
}

export interface StudyConfigFlattened {
  'balance.equalTo': number;
  'balance.greaterThan': number;
  'balance.idk'?: number;
  'balance.lessThan': number;
  contextualControl: boolean;
  idk: boolean;
  participantId: string;
  trialTimeout: number; // in seconds
}
