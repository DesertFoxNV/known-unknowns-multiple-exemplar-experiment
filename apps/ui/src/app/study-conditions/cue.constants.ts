export const CUE_TYPE = {
  nonArbitrary: 'non-arbitrary', // SAME, DIFFERENT, GREATER THAN, LESS THAN, I CANNOT KNOW
  arbitrary: 'arbitrary' // NONSENSE CUES
} as const;

export type CueType = typeof CUE_TYPE[keyof typeof CUE_TYPE];

export const CUE_TYPES: CueType[] = Object.values(CUE_TYPE);

export interface CueTypeOption {
  value: string;
  viewValue: string;
}

export const CUE_TYPES_OPTIONS: CueTypeOption[] = Object.values(CUE_TYPE).map(ct => ({ value: ct, viewValue: ct }));

export const BUTTON_TEXT_FILE_PATH = `url('./assets/button-text.svg')`;

export const CUE_ARBITRARY_FILENAME = {
  image1: `url('./assets/button-1.svg')`,
  image2: `url('./assets/button-2.svg')`,
  image3: `url('./assets/button-3.svg')`,
  image4: `url('./assets/button-4.svg')`,
  image5: `url('./assets/button-5.svg')`
} as const;

export type CueArbitraryFilename = typeof CUE_ARBITRARY_FILENAME[keyof typeof CUE_ARBITRARY_FILENAME];

export const CUES_ARBITRARY_FILE_PATHS: CueArbitraryFilename[] = Object.values(CUE_ARBITRARY_FILENAME);

export const CUE_NON_ARBITRARY = {
  same: 'SAME',
  different: 'DIFFERENT',
  greaterThan: 'GREATER THAN',
  lessThan: 'LESS THAN',
  iCannotKnow: `I CANNOT KNOW`
} as const;

export type CueNonArbitrary = typeof CUE_NON_ARBITRARY[keyof typeof CUE_NON_ARBITRARY];

export type CueTuple<T> = [T, T];

export const CUES_NON_ARBITRARY_W_ICK: CueNonArbitrary[] = Object.values(CUE_NON_ARBITRARY).filter(
  rc => rc !== CUE_NON_ARBITRARY.different);
export const CUES_NON_ARBITRARY_WO_ICK: CueNonArbitrary[] = Object.values(CUE_NON_ARBITRARY).filter(
  rc => rc !== CUE_NON_ARBITRARY.iCannotKnow && rc !== CUE_NON_ARBITRARY.different);


