import { Params } from '@angular/router';

export function paramToBool(key: string, params: Params): boolean {
  const validBooleanStrings = ['true', 'false'];
  if (params?.[key] === undefined) throw Error(`Required param "${key}" not found`);
  if (!validBooleanStrings.includes(params[key]))
    throw Error(
      `Invalid param "${key}", value was "${params[key]}". Valid values are ${validBooleanStrings.join(' and ')}`);
  return params[key] === 'true';
}
