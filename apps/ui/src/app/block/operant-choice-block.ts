import { shuffle } from 'lodash-es';
import { KnownNetwork } from '../network/known-network';
import {
  BUTTON_TEXT_FILE_PATH, CUE_NON_ARBITRARY_TO_FILENAME, CUE_TYPE, CUES_NON_ARBITRARY_W_ICK, CUES_NON_ARBITRARY_WO_ICK
} from '../study-conditions/cue.constants';
import { StudyConfig } from '../study-config-form/study-config';
import { Block } from './block';

// 32 trials = (4 combinations x 2 networks) x 4 duplicates
export class OperantChoiceBlock extends Block {
  network1: KnownNetwork;
  network2: KnownNetwork;

  constructor(
    network1: KnownNetwork,
    network2: KnownNetwork,
    config: StudyConfig
  ) {
    super('Operant Choice', config);
    this.network1 = network1;
    this.network2 = network2;
  }

  createTrials() {
    const cues = shuffle(this.config.iCannotKnow ? CUES_NON_ARBITRARY_W_ICK : CUES_NON_ARBITRARY_WO_ICK);

    const cueComponentConfigs = cues.map((cue) => ({
      isArbitrary: this.config.cueType === CUE_TYPE.arbitrary,
      fileName: this.config.cueType === CUE_TYPE.nonArbitrary ? BUTTON_TEXT_FILE_PATH :
        CUE_NON_ARBITRARY_TO_FILENAME[cue],
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
    return shuffle(this.trials);
  }

  feedbackEnabled(): boolean {
    return true;
  }
}
