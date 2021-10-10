import { sample } from 'lodash-es';

export enum CueType {
  nonArbitrary = 'non-arbitrary', // SAME, DIFFERENT, GREATER THAN, LESS THAN, IDK
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
  if (cueType === undefined) throw Error('Random cue type returned "undefined"!');
  return cueType;
}

export const BUTTON_TEXT_FILE_PATH = './assets/button-text.svg';

export enum CueArbitraryFilenames {
  image1 = './assets/button-1.svg',
  image2 = './assets/button-2.svg',
  image3 = './assets/button-3.svg',
  image4 = './assets/button-4.svg',
  image5 = './assets/button-5.svg',
}

export const CUES_ARBITRARY_FILE_PATHS: CueArbitraryFilenames[] = Object.values(CueArbitraryFilenames);

export enum CueNonArbitrary {
  same = 'SAME',
  different = 'DIFFERENT',
  greaterThan = 'GREATER THAN',
  lessThan = 'LESS THAN',
  idk = `I DON'T KNOW`,
}

export const CUES_NON_ARBITRARY_W_IDK: CueNonArbitrary[] = Object.values(CueNonArbitrary).filter(
  rc => rc !== CueNonArbitrary.different);
export const CUES_NON_ARBITRARY_WO_IDK: CueNonArbitrary[] = Object.values(CueNonArbitrary).filter(
  rc => rc !== CueNonArbitrary.idk && rc !== CueNonArbitrary.different);


