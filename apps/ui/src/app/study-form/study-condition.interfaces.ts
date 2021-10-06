export interface BalanceConditions {
  equalTo: number;
  greaterThan: number;
  idk?: number;
  lessThan: number;
}

export interface StudyConditions {
  balance: BalanceConditions;
  contextualControl: boolean;
  idk: boolean;
  participantId: string;
  trialTimeout: number; // in seconds
}
