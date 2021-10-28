import { StimuliComparison } from '../network/stimuli-comparison';
import { TrialCueComponentConfig } from '../study-conditions/trial-cue-component-config';
import { CueSelected } from './cue-selected';

export interface Trial extends StimuliComparison {
  cueComponentConfigs: TrialCueComponentConfig[];
}

export interface CompletedTrial extends Trial {
  selected: CueSelected|undefined;
}
