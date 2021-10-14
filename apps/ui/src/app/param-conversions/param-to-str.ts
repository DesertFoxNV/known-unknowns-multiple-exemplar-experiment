import { Params } from '@angular/router';

export function paramToStr(key: string, params: Params, minLength = 3): string {
  if (params?.[key] === undefined) throw Error(`Required param "${key}" not found`);
  if (params[key].length < minLength)
    throw Error(
      `Invalid param "${key}", value was "${params[key]}". Value must have a minimum length of ${minLength}`);
  return params[key];
}

