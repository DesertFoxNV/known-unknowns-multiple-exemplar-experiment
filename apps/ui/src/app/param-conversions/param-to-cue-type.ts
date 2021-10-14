import { Params } from '@angular/router';
import { CUE_TYPES, CueType } from '../study-conditions/cue.constants';

export function paramToCueType(key: string, params: Params): CueType {
  if (params?.[key] === undefined) throw Error(`Required param "${key}" not found`);
  const cueType = CUE_TYPES.find(type => type == params[key]);
  if (!cueType)
    throw Error(
      `Invalid param "${key}", value was "${params[key]}". Value must be ${CUE_TYPES.join(' or ')}`);
  return cueType;
}
