import { CueNonArbitrary } from '../study-conditions/cue.constants';

type SameGtLtIckOperators = 'same'|'greaterThan'|'lessThan'|'iCannotKnow';
type SameDifferentIckOperators = 'same'|'different'|'iCannotKnow';

export const COMBINATORIALLY_ENTAILED_DICTIONARY_SAME_GT_LT_ICK: Record<SameGtLtIckOperators, Record<SameGtLtIckOperators, CueNonArbitrary>> = {
  greaterThan: {
    same: 'greaterThan',
    greaterThan: 'greaterThan',
    lessThan: 'iCannotKnow',
    iCannotKnow: 'iCannotKnow'
  },
  lessThan: {
    same: 'lessThan',
    greaterThan: 'iCannotKnow',
    lessThan: 'lessThan',
    iCannotKnow: 'iCannotKnow'
  },
  same: {
    same: 'same',
    greaterThan: 'greaterThan',
    lessThan: 'lessThan',
    iCannotKnow: 'iCannotKnow'
  },
  iCannotKnow: {
    same: 'iCannotKnow',
    greaterThan: 'iCannotKnow',
    lessThan: 'iCannotKnow',
    iCannotKnow: 'iCannotKnow'
  }
};

export const COMBINATORIALLY_ENTAILED_DICTIONARY_SAME_DIFFERENT_ICK: Record<SameDifferentIckOperators, Record<SameDifferentIckOperators, CueNonArbitrary>> = {
  same: {
    same: 'same',
    different: 'different',
    iCannotKnow: 'iCannotKnow'
  },
  different: {
    same: 'same',
    different: 'different',
    iCannotKnow: 'iCannotKnow'
  },
  iCannotKnow: {
    same: 'iCannotKnow',
    different: 'iCannotKnow',
    iCannotKnow: 'iCannotKnow'
  }
};

export const MUTUALLY_ENTAILED_DICTIONARY_SAME_GT_LT_ICK: Record<SameGtLtIckOperators, CueNonArbitrary> = {
  same: 'same',
  lessThan: 'greaterThan',
  greaterThan: 'lessThan',
  iCannotKnow: 'iCannotKnow'
};

export const MUTUALLY_ENTAILED_DICTIONARY_SAME_DIFFERENT_ICK: Record<SameDifferentIckOperators, CueNonArbitrary> = {
  same: 'same',
  different: 'same',
  iCannotKnow: 'iCannotKnow'
};
