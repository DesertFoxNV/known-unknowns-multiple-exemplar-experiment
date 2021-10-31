import { shuffle } from 'lodash-es';
import { KnownNetwork } from '../network/known-network';
import { KnownUnknownNetwork } from '../network/known-unknown-network';
import {
  BUTTON_TEXT_FILE_PATH, CUE_NON_ARBITRARY_TO_FILENAME, CUE_TYPE, CUES_NON_ARBITRARY_W_ICK, CUES_NON_ARBITRARY_WO_ICK
} from '../study-conditions/cue.constants';
import { StudyConfig } from '../study-config-form/study-config';
import { Block } from './block';

export class TestBlock extends Block {
  knownNetwork: KnownNetwork;
  knownUnknownNetwork: KnownUnknownNetwork;
  numDuplicates: number;

  /**
   * Test Block
   *  Creates a test block with a known and unknown network.
   *  32 trials default (8 * numDuplicates trials)
   *    16 mutually entailed trials (default) = mutually-entailed (B:A, C:A) * numDuplicates (4 default) * 2 networks
   *    16 combinatorially entailed trials (default) = combinatorially-entailed (B:C, C:B) * numDuplicates  (4 default) * 2 networks
   * @param {KnownNetwork} knownNetwork
   * @param {KnownUnknownNetwork} knownUnknownNetwork
   * @param {StudyConfig} config
   * @param numDuplicates the number of mutually entailed and combinatorially-entailed duplicates
   */
  constructor(
    knownNetwork: KnownNetwork,
    knownUnknownNetwork: KnownUnknownNetwork,
    config: StudyConfig,
    numDuplicates = 4
  ) {
    super('Test', config);
    this.knownNetwork = knownNetwork;
    this.knownUnknownNetwork = knownUnknownNetwork;
    this.numDuplicates = numDuplicates;
  }

  /**
   * Creates trials.
   * @returns {unknown[] | Array<Trial[][keyof Trial[]]>}
   */
  createTrials() {
    // Cue order is randomized
    const cues = shuffle(this.config.iCannotKnow ? CUES_NON_ARBITRARY_W_ICK : CUES_NON_ARBITRARY_WO_ICK);

    // Cue component configurations are mapped from cue order
    const cueComponentConfigs = cues.map((cue) => ({
      isArbitrary: this.config.cueType === CUE_TYPE.arbitrary,
      fileName: this.config.cueType === CUE_TYPE.nonArbitrary ? BUTTON_TEXT_FILE_PATH :
        CUE_NON_ARBITRARY_TO_FILENAME[cue],
      value: cue
    }));

    // Mutually entailed and combinatorially entailed trials are generated for each network
    for (const network of [this.knownNetwork, this.knownUnknownNetwork]) {
      for (let i = 0; i < this.numDuplicates; i++) {
        this.trials = this.trials.concat([
            network.mutuallyEntailed,
            network.combinatoriallyEntailed
          ].flat().map(stimuliComparison => ({ ...stimuliComparison, cueComponentConfigs }))
        );
      }
    }

    // The trials are shuffled to ensure random order.
    return shuffle(this.trials);
  }
}
