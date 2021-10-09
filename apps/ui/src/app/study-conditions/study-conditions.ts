import { CueCase, randomTrigramCase } from './cue-case';
import { getRandomCues } from './get-random-cue';
import { CueType, randomCueType } from './cue';

export class StudyConditions {
  cues: {
    case: CueCase,
    type: CueType,
    options: string[]
  };

  constructor() {
    const cueCase = randomTrigramCase();
    this.cues = {
      case: cueCase,
      type: randomCueType(),
      options: getRandomCues(12, cueCase)
    };
  }
}
