import { TrigramCase } from './trigram-case';
import { getRandomLetter } from './get-random-letter';

export function getRandomTrigram(strCase: TrigramCase): string {
  return [...Array(3)].map(v => getRandomLetter(strCase)).join('');
}

// Assumes num is integer
export function getRandomTrigrams(num: number, strCase: TrigramCase): string[] {
  const trigrams: string[] = [];
  while (trigrams.length < num) {
    const trigram = getRandomTrigram(strCase);
    if(!trigrams.includes(trigram)) trigrams.push(trigram)
  }
  return trigrams;
}
