import { Params } from '@angular/router';

export function paramToNonZeroPositiveNum(key: string, params: Params): number {
  if (params?.[key] === undefined) throw Error(`Required param "${key}" not found`);
  const num = +params[key];
  if (isNaN(num) || num < 1) throw Error(
    `Invalid param "${key}", value was "${params[key]}". Value must be a non zero positive number`);
  return parseFloat(params[key]);
}
