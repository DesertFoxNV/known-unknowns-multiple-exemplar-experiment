import { Params } from '@angular/router';

export function paramToNum(key: string, params: Params): number {
  if (params?.[key] === undefined) throw Error(`Required param "${key}" not found`);
  if (isNaN(+params[key])) throw Error(`Invalid param "${key}", value was "${params[key]}". Value must be a number`);
  return parseFloat(params[key]);
}
