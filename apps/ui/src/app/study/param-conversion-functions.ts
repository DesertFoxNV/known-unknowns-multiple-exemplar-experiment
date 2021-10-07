import { Params } from '@angular/router';
import { unflatten } from 'flat';
import { StudyConfig, StudyConfigFlattened } from '../study-config-form/study-config.interfaces';

export function paramToBool(key: string, params: Params): boolean {
  const validBooleanStrings = ['true', 'false'];
  if (params?.[key] === undefined) throw Error(`Required param "${key}" not found`);
  if (!validBooleanStrings.includes(params[key]))
    throw Error(
      `Invalid param "${key}", value was "${params[key]}". Valid values are ${validBooleanStrings.join(' and ')}`);
  return params[key] === 'true';
}

export function paramToStr(key: string, params: Params, minLength = 3): boolean {
  if (params?.[key] === undefined) throw Error(`Required param "${key}" not found`);
  if (params[key].length < minLength)
    throw Error(
      `Invalid param "${key}", value was "${params[key]}". Value must have a minimum length of ${minLength}`);
  return params[key];
}

export function paramToNum(key: string, params: Params): number {
  if (params?.[key] === undefined) throw Error(`Required param "${key}" not found`);
  if (isNaN(+params[key])) throw Error(`Invalid param "${key}", value was "${params[key]}". Value must be a number`);
  return parseFloat(params[key]);
}

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
