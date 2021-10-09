import { Params } from '@angular/router';
import { unflatten } from 'flat';
import { StudyConfig, StudyConfigFlattened } from '../study-config-form/study-config.interfaces';
import { paramToBool, paramToNum, paramToStr } from './param-conversion-functions';

export function studyConfigFromParams(params: Params): StudyConfig {
  const idk = paramToBool('idk', params);

  const paramsToConfigFnDict: Record<keyof StudyConfigFlattened, ((
    key: string,
    params: Params
  ) => unknown)|undefined> = {
    'balance.equalTo': paramToNum,
    'balance.greaterThan': paramToNum,
    'balance.idk': idk ? paramToNum : undefined,
    'balance.lessThan': paramToNum,
    contextualControl: paramToBool,
    idk: paramToBool,
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
