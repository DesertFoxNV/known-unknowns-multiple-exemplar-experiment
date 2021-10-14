import { StimuliComparison } from '../network/stimuli-comparison';
import { TrialCueComponentConfig } from '../study-conditions/trial-cue-component-config';

export interface Trial extends StimuliComparison {
  cueComponentConfigs: TrialCueComponentConfig[];
}
