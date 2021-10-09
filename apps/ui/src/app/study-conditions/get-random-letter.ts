import { TrigramCase } from './trigram-case';
import { getRandomInt } from './get-random-int';

export function getRandomLetter(strCase: TrigramCase) {
  const charCodeOffset = (strCase === TrigramCase.upper ? 65 : 97);
  return String.fromCharCode(charCodeOffset + getRandomInt(26));
}
