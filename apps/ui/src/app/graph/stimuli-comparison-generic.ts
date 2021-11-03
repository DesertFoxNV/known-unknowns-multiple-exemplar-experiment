import { RelationalNode } from './relational-node';

export interface StimuliComparisonGeneric {
  relation: string;
  relationType: string;
  stimuli: [RelationalNode, RelationalNode];
}
