import { Params } from '@angular/router';

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

