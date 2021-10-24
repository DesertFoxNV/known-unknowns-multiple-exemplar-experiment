import {shuffle} from 'lodash-es';
import {BinaryNetwork} from '../network/binary-network';
import {CUE_NON_ARBITRARY} from '../study-conditions/cue.constants';
import {StudyConfig} from '../study-config-form/study-config';
import {Block} from './block';
import {oneChoiceCueComponentConfig} from './one-choice-cue-component-config';

// 12 trials = 6 identities (A:A x 2, B:B x 2, C:C x 2) x 6 different (A:B, B:C, C:A, B:A, C:B, A:C)
export class ForcedChoiceBlock extends Block {
  network: BinaryNetwork;

  showFeedback = true;

  constructor(
    network: BinaryNetwork,
    config: StudyConfig
  ) {
    super('Forced choice block');
    this.network = network;
    this.createTrials(config);
  }

  createTrials(config: StudyConfig) {
    const sameCueComponentConfigs = oneChoiceCueComponentConfig(config, CUE_NON_ARBITRARY.same);
    const differentCueComponentConfig = oneChoiceCueComponentConfig(config, CUE_NON_ARBITRARY.different);

    const sameTrials = shuffle([
      this.network.identities,
      this.network.identities,
      this.network.identities
    ].flat().map(stimuliComparison => ({...stimuliComparison, cueComponentConfigs: sameCueComponentConfigs})));

    const differentTrials = shuffle([
      this.network.trained,
      this.network.mutuallyEntailed,
      this.network.combinatoriallyEntailed
    ].flat().map((stimuliComparison) => ({...stimuliComparison, cueComponentConfigs: differentCueComponentConfig})));

    this.trials = sameTrials.concat(differentTrials);
  }
}
