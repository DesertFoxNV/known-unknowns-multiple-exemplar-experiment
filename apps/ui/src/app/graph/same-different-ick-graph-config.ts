import { InjectionToken } from '@angular/core';
import {
  COMBINATORIALLY_ENTAILED_DICTIONARY_SAME_DIFFERENT_ICK, MUTUALLY_ENTAILED_DICTIONARY_SAME_DIFFERENT_ICK
} from './operator-dictionaries';
import { RelationalFrameGraphConfig } from './relational-frame-graph-config';

export const SAME_DIFFERENT_ICK_GRAPH_CONFIG = new InjectionToken('Configuration for same, different, and ick graph.');

export const SAME_DIFFERENT_ICK_GRAPH_CONFIG_VALUE: RelationalFrameGraphConfig = {
  selfRelation: 'same',
  unknownRelation: 'iCannotKnow',
  mutualDictionary: MUTUALLY_ENTAILED_DICTIONARY_SAME_DIFFERENT_ICK,
  combinatorialDictionary: COMBINATORIALLY_ENTAILED_DICTIONARY_SAME_DIFFERENT_ICK
};
