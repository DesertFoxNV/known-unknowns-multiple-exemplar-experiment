import { shuffle } from 'lodash-es';
import { BinaryNetwork } from '../network/binary-network';
import {
  BUTTON_TEXT_FILE_PATH, CUE_NON_ARBITRARY, CUE_TYPE, CUES_ARBITRARY_FILE_PATHS
} from '../study-conditions/cue.constants';
import { StudyConfig } from '../study-config-form/study-config';
import { Block } from './block';

// 12 trials = 6 identities (A:A x 2, B:B x 2, C:C x 2) x 6 different (A:B, B:C, C:A, B:A, C:B, A:C)
export class ForcedChoiceBlock extends Block {
  network: BinaryNetwork;

  constructor(
    network: BinaryNetwork,
    config: StudyConfig
  ) {
    super('Forced choice block');
    this.network = network;
    this.createTrials(config);
  }

  createTrials(config: StudyConfig) {
    const arbitraryFileNames = shuffle(CUES_ARBITRARY_FILE_PATHS);
    const sameCueComponentConfigs = new Array(4).fill({
      isArbitrary: config.cueType === CUE_TYPE.arbitrary,
      fileName: config.cueType === CUE_TYPE.nonArbitrary ? BUTTON_TEXT_FILE_PATH : arbitraryFileNames[1],
      value: CUE_NON_ARBITRARY.same
    });

    const differentCueComponentConfig = new Array(4).fill({
      isArbitrary: config.cueType === CUE_TYPE.arbitrary,
      fileName: config.cueType === CUE_TYPE.nonArbitrary ? BUTTON_TEXT_FILE_PATH : arbitraryFileNames[1],
      value: CUE_NON_ARBITRARY.different
    });

    const sameTrials = [];
    for (let i = 0; i < 2; i++) {
      sameTrials.push(
        ...this.network.identities.map(
          stimuliComparison => ({ ...stimuliComparison, cueComponentConfigs: sameCueComponentConfigs })));
    }

    const differentTrials = [];
    differentTrials.push(
      ...this.network.trained.map(
        stimuliComparison => ({ ...stimuliComparison, cueComponentConfigs: differentCueComponentConfig })),
      ...this.network.mutuallyEntailed.map(
        stimuliComparison => ({ ...stimuliComparison, cueComponentConfigs: differentCueComponentConfig })),
      ...this.network.combinatoriallyEntailed.map(
        stimuliComparison => ({ ...stimuliComparison, cueComponentConfigs: differentCueComponentConfig }))
    );

    this.trials.push(...shuffle(sameTrials), ...shuffle(differentTrials));
  }
}
