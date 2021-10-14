import { shuffle } from 'lodash-es';
import { Network } from '../network/network';
import {
  BUTTON_TEXT_FILE_PATH, CUE_TYPE, CUES_ARBITRARY_FILE_PATHS, CUES_NON_ARBITRARY_W_ICK, CUES_NON_ARBITRARY_WO_ICK
} from '../study-conditions/cue.constants';
import { StudyConfig } from '../study-config-form/study-config';
import { Trial } from '../trial/trial';
import { Block } from './block';

export class PreTestBlock extends Block {
  completed?: Date;
  index = 0;
  network1: Network;
  network2: Network;
  started: Date|undefined;
  trials: Trial[] = []; // 32 trials = (4 combinations x 2 networks) x 4 duplicates

  constructor(
    network1: Network,
    network2: Network,
    config: StudyConfig
  ) {
    super('Pre-Test');
    this.network1 = network1;
    this.network2 = network2;

    const cueType = config.cueType;
    const cues = shuffle(config.iCannotKnow ? CUES_NON_ARBITRARY_W_ICK : CUES_NON_ARBITRARY_WO_ICK);
    const arbitraryFileNames = shuffle(CUES_ARBITRARY_FILE_PATHS);

    const cueComponentConfigs = cues.map((cue, i) => ({
      isArbitrary: config.cueType === CUE_TYPE.arbitrary,
      fileName: cueType === CUE_TYPE.nonArbitrary ? BUTTON_TEXT_FILE_PATH : arbitraryFileNames[i],
      value: cue
    }));

    for (const network of [this.network1, this.network2]) {
      for (let i = 0; i < 4; i++) {
        this.trials.push(
          ...network.mutuallyEntailed.map(stimuliComparison => ({ ...stimuliComparison, cueComponentConfigs })));
        this.trials.push(
          ...network.combinatoriallyEntailed.map(stimuliComparison => ({ ...stimuliComparison, cueComponentConfigs }))
        );
      }
    }
    this.trials = shuffle(this.trials);
  }

  nextTrial(): Trial|undefined {
    if (this.index === 0) this.started = new Date();
    if (this.index > this.trials.length) this.completed = new Date;
    this.index++;
    return this.trials?.[this.index];
  }
}
