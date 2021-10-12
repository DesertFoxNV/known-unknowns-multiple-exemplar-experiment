import { Params } from '@angular/router';
import { unflatten } from 'flat';
import { StudyConfigFlattened } from '../study-config-form/study-config-flattened';
import { StudyConfig} from '../study-config-form/study-config';
import { paramToBool } from './param-to-bool';
import { paramToNum } from './param-to-num';
import { paramToStr } from './param-to-str';

export function studyConfigFromParams(params: Params): StudyConfig {
  const iCannotKnow = paramToBool('iCannotKnow', params);

  const paramsToConfigFnDict: Record<keyof StudyConfigFlattened, ((
    key: string,
    params: Params
  ) => unknown)|undefined> = {
    'balance.equalTo': paramToNum,
    'balance.greaterThan': paramToNum,
    'balance.iCannotKnow': iCannotKnow ? paramToNum : undefined,
    'balance.lessThan': paramToNum,
    contextualControl: paramToBool,
    cueType: paramToStr,
    iCannotKnow: paramToBool,
    participantId: paramToStr,
    trialTimeout: paramToNum
  };

  const configFlattened = Object.entries(paramsToConfigFnDict)
    .reduce((acc, [k, v]) => {
      if (v) acc[k] = v(k, params);
      return acc;
    }, {} as { [key: string]: unknown });

  return unflatten(configFlattened);
}
