import { RelationalNode } from '../graph/relational-node';
import { StimuliComparison } from '../graph/stimuli-comparison';
import { TrialCueComponentConfig } from '../study-conditions/trial-cue-component-config';
import { CueSelected } from './cue-selected';

export interface Trial extends StimuliComparison<RelationalNode> {
  cueComponentConfigs: TrialCueComponentConfig[];
}

export interface CompletedTrial extends Trial {
  selected: CueSelected|undefined;
}
