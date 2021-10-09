import { sample } from 'lodash-es';

export enum RelationCueType {
  nonArbitrary = 'non-arbitrary', // SAME, DIFFERENT, GREATER THAN, LESS THAN, IDK
  arbitrary = 'arbitrary' // NONSENSE CUES
}

export const RELATION_CUE_TYPES: RelationCueType[] = Object.values(RelationCueType);

export function randomCueType(): RelationCueType {
  const cueType = sample(RELATION_CUE_TYPES);
  if (cueType === undefined) throw Error('Random cue type returned "undefined"!');
  return cueType;
}

export enum RelationalCueArbitrary {
  image1 = 'image1',
  image2 = 'image2',
  image3 = 'image3',
  image4 = 'image4',
  image5 = 'image5',
}

export const ARBITRARY_CUES: RelationalCueArbitrary[] = Object.values(RelationalCueArbitrary);

export enum RelationalCueNonArbitrary {
  same = 'SAME',
  different = 'DIFFERENT',
  greaterThan = 'GREATER THAN',
  lessThan = 'LESS THAN',
  idk = 'IDK',
}

export const NON_ARBITRARY_W_IDK: RelationalCueNonArbitrary[] = Object.values(RelationalCueNonArbitrary);
export const NON_ARBITRARY_WO_IDK: RelationalCueNonArbitrary[] = Object.values(RelationalCueNonArbitrary).filter(
  rc => rc !== RelationalCueNonArbitrary.idk);


