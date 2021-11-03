import { CueType } from '../study-conditions/cue.constants';
import { StimulusCase } from '../study-conditions/stimulus-case';
import { BalanceConfig } from './balance-config';

export interface StudyConfig {
  balance: BalanceConfig;
  contextualControl: boolean;
  cueType: CueType;
  iCannotKnow: boolean;
  participantId: string;
  trialTimeoutSeconds: number;
}

export interface StudyConfigWCase extends StudyConfig {
  stimulusCase: StimulusCase; // assigned in the study condition service not the study config form
}

