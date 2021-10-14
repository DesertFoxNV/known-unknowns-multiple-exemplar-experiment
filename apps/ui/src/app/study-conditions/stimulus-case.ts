export const STIMULUS_CASE = {
  lower: 'lower',
  upper: 'upper'
} as const;

export type StimulusCase = typeof STIMULUS_CASE[keyof typeof STIMULUS_CASE];

export const STIMULUS_CASES: StimulusCase[] = Object.values(STIMULUS_CASE);
