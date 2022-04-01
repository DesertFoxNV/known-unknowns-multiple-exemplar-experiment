import { StudyConfig } from '../study-config-form/study-config';

export interface ReportEntry {
  balanceEquivalence: StudyConfig['balance']['same'];
  balanceGreaterThan: StudyConfig['balance']['greaterThan'];
  balanceICannotKnow: StudyConfig['balance']['iCannotKnow'];
  balanceLessThan: StudyConfig['balance']['lessThan'];
  blockAttempts: number;
  blockId: string;
  button1Image: string;
  button1Relation: string;
  button2Image: string;
  button2Relation: string;
  button3Image: string;
  button3Relation: string;
  button4Image: string;
  button4Relation: string;
  buttonPosition: number;
  comparison: string;
  comparisonNode: string;
  consequence: string;
  containsSequentialTriplicates: string;
  contextualControl: StudyConfig['contextualControl']|'';
  correctResponse: string;
  cueType: StudyConfig['cueType']|'';
  failSafeDuration: string;
  iCannotKnow: StudyConfig['iCannotKnow']|'';
  participantId: StudyConfig['participantId'];
  probeAttempts: number;
  retryInstructions: string;
  sample: string;
  sampleNode: string;
  selectedResponse: string;
  sequentialCorrect: number;
  startInstructions: string;
  stimulusCase: string;
  studyFailed: string;
  studyInstructions: string;
  totalTrials: number;
  trainingAttempts: number;
  trialCompleted: Date|string;
  trialDurationInSeconds: number;
  trialNumber: number;
  trialOutcome: string;
  trialStarted: Date|string;
  trialTimeoutSeconds: StudyConfig['trialTimeoutSeconds'];
}