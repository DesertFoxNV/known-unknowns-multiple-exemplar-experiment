import { Params } from '@angular/router';
import { unflatten } from 'flat';
import { StudyConfig } from '../study-config-form/study-config';
import { StudyConfigFlattened } from '../study-config-form/study-config-flattened';
import { paramToBool } from './param-to-bool';
import { paramToCueType } from './param-to-cue-type';
import { paramToNonZeroPositiveNum } from './param-to-non-zero-positive-num';
import { paramToStr } from './param-to-str';

type ObjectKeysToFnDict<T> = { [K in keyof T]: ((key: K|string, params: Params) => T[K])|undefined }

export function studyConfigFromParams(params: Params): StudyConfig {
  const iCannotKnow = paramToBool('iCannotKnow', params);

  const paramsToConfigFnDict: ObjectKeysToFnDict<StudyConfigFlattened> = {
    'balance.equalTo': paramToNonZeroPositiveNum,
    'balance.greaterThan': paramToNonZeroPositiveNum,
    'balance.iCannotKnow': iCannotKnow ? paramToNonZeroPositiveNum : undefined,
    'balance.lessThan': paramToNonZeroPositiveNum,
    contextualControl: paramToBool,
    cueType: paramToCueType,
    iCannotKnow: paramToBool,
    participantId: paramToStr,
    trialTimeout: paramToNonZeroPositiveNum
  };

  const configFlattened = Object.fromEntries(
    Object.entries(paramsToConfigFnDict)
      .map(([key, value]) => [key, value && value(key, params)])
  );

  return unflatten(configFlattened);
}
