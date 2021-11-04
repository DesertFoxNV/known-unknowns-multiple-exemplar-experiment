import { CueNonArbitrary } from './cue.constants';

export interface TrialCueComponentConfig {
  fileName: string,
  isArbitrary: boolean,
  value: CueNonArbitrary,
  viewValue: string
}
