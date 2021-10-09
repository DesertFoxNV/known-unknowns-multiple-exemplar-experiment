import { sample } from 'lodash-es';

export enum CueType {
  nonArbitrary = 'non-arbitrary', // SAME, DIFFERENT, GREATER THAN, LESS THAN, IDK
  arbitrary = 'arbitrary' // NONSENSE CUES
}

export const CUE_TYPES: CueType[] = Object.values(CueType);

export function randomCueType(): CueType {
  const cueType = sample(CUE_TYPES);
  if (cueType === undefined) throw Error('Random cue type returned "undefined"!');
  return cueType;
}

export enum CueArbitraryFilenames {
  image1 = 'button-1.svg',
  image2 = 'button-2.svg',
  image3 = 'button-3.svg',
  image4 = 'button-4.svg',
  image5 = 'button-5.svg',
}

export const CUES_ARBITRARY_FILE_NAMES: CueArbitraryFilenames[] = Object.values(CueArbitraryFilenames);

export enum CueNonArbitrary {
  same = 'SAME',
  different = 'DIFFERENT',
  greaterThan = 'GREATER THAN',
  lessThan = 'LESS THAN',
  idk = 'IDK',
}

export const CUES_NON_ARBITRARY_W_IDK: CueNonArbitrary[] = Object.values(CueNonArbitrary);
export const CUES_NON_ARBITRARY_WO_IDK: CueNonArbitrary[] = Object.values(CueNonArbitrary).filter(
  rc => rc !== CueNonArbitrary.idk);


