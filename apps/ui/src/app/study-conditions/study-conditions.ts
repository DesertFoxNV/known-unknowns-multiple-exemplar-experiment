import { getRandomTrigrams } from './get-random-trigram';
import { randomCueType, RelationCueType } from './relation-cue';
import { randomTrigramCase, TrigramCase } from './trigram-case';

export class StudyConditions {
  relationalCueType: RelationCueType;
  trigramCase: TrigramCase;
  trigrams: string[];

  constructor() {
    this.relationalCueType = randomCueType();
    this.trigramCase = randomTrigramCase();
    this.trigrams = getRandomTrigrams(12, this.trigramCase);
  }
}
