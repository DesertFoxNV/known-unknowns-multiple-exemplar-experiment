import { StimuliComparison } from '../network/stimuli-comparison';
import { TrialCueComponentConfig } from '../study-conditions/trial-cue-component-config';

export interface CueSelected {
  cue: TrialCueComponentConfig,
  position: number
}

export type Trial = StimuliComparison;
