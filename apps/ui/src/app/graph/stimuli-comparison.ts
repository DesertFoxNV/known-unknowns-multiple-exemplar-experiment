export interface StimuliComparison<N> {
  relation: string;
  relationType: string;
  stimuli: [N, N];
}
