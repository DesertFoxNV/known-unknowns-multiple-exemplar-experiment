import { sample } from 'lodash-es';

export enum CueType {
  nonArbitrary = 'non-arbitrary', // SAME, DIFFERENT, GREATER THAN, LESS THAN, I CANNOT KNOW
  arbitrary = 'arbitrary' // NONSENSE CUES
}

export const CUE_TYPES: CueType[] = Object.values(CueType);

export interface CueTypeOption {
  value: string;
  viewValue: string;
}

export const CUE_TYPES_OPTIONS: CueTypeOption[] = Object.values(CueType).map(ct => ({ value: ct, viewValue: ct }));

export function randomCueType(): CueType {
  const cueType = sample(CUE_TYPES);
  if (cueType === undefined) throw Error('Random value type returned "undefined"!');
  return cueType;
}

export const BUTTON_TEXT_FILE_PATH = `url('./assets/button-text.svg')`;

export enum CueArbitraryFilenames {
  image1 = `url('./assets/button-1.svg')`,
  image2 = `url('./assets/button-2.svg')`,
  image3 = `url('./assets/button-3.svg')`,
  image4 = `url('./assets/button-4.svg')`,
  image5 = `url('./assets/button-5.svg')`,
}

export const CUES_ARBITRARY_FILE_PATHS: CueArbitraryFilenames[] = Object.values(CueArbitraryFilenames);

export enum CueNonArbitrary {
  same = 'SAME',
  different = 'DIFFERENT',
  greaterThan = 'GREATER THAN',
  lessThan = 'LESS THAN',
  iCannotKnow = `I CANNOT KNOW`,
}

export type CueTuple = [CueNonArbitrary.same|CueNonArbitrary.greaterThan|CueNonArbitrary.lessThan, CueNonArbitrary.same|CueNonArbitrary.greaterThan|CueNonArbitrary.lessThan];

export const CUES_NON_ARBITRARY_W_ICK: CueNonArbitrary[] = Object.values(CueNonArbitrary).filter(
  rc => rc !== CueNonArbitrary.different);
export const CUES_NON_ARBITRARY_WO_ICK: CueNonArbitrary[] = Object.values(CueNonArbitrary).filter(
  rc => rc !== CueNonArbitrary.iCannotKnow && rc !== CueNonArbitrary.different);


