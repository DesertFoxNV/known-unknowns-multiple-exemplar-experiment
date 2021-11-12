import { StudyConfig } from '../study-config-form/study-config';

export interface ReportEntry {
  balanceEquivalence: StudyConfig['balance']['same'];
  balanceGreaterThan: StudyConfig['balance']['greaterThan'];
  balanceICannotKnow: StudyConfig['balance']['iCannotKnow'];
  balanceLessThan: StudyConfig['balance']['lessThan'];
  blockId: string;
  contextualControl: StudyConfig['contextualControl']|'';
  cueType: StudyConfig['cueType']|'';
  iCannotKnow: StudyConfig['iCannotKnow']|'';
  participantId: StudyConfig['participantId'];
  studyInstructions: string;
  trialTimeoutSeconds: StudyConfig['trialTimeoutSeconds'];
  blockAttempts: number;
  stimulusCase: string;
}
