import {shuffle} from 'lodash-es';
import {BinaryNetwork} from '../network/binary-network';
import {CUE_NON_ARBITRARY} from '../study-conditions/cue.constants';
import {StudyConfig} from '../study-config-form/study-config';
import {Block} from './block';
import {twoChoiceCueComponentConfig} from './one-choice-cue-component-config';
import {StimuliComparison} from "../network/stimuli-comparison";

// 12 trials ? = 5 different (A:B, B:C, C:A, B:A, C:B, A:C) x 5 ICK
export class DifferentIdkBlock extends Block {
  network: BinaryNetwork;
  showFeedback = false;
  unknownNetwork: BinaryNetwork;

  constructor(
    network: BinaryNetwork,
    unknownNetwork: BinaryNetwork,
    config: StudyConfig
  ) {
    super('Different idk block');
    this.network = network;
    this.unknownNetwork = unknownNetwork;
    this.createTrials(config);
  }

  createTrials(config: StudyConfig) {
    const differentTrials = shuffle([
      this.network.trained,
      this.network.mutuallyEntailed,
      this.network.combinatoriallyEntailed
    ].flat().map(
      stimuliComparison => ({
        ...stimuliComparison,
        cueComponentConfigs: twoChoiceCueComponentConfig(config, CUE_NON_ARBITRARY.different, CUE_NON_ARBITRARY.iCannotKnow)
      })
    ));

    const ickStimuliComparisons: StimuliComparison[] = [];
    for (const stimuli1 of this.network.stimuli) {
      for (const stimuli2 of this.unknownNetwork.stimuli) {
        ickStimuliComparisons.push(
          {
            cue: CUE_NON_ARBITRARY.iCannotKnow,
            stimuli: [stimuli1, stimuli2]
          },
          {cue: CUE_NON_ARBITRARY.iCannotKnow, stimuli: [stimuli2, stimuli1]})
      }
    }

    const idkTrials = shuffle(
      ickStimuliComparisons
    ).map(stimuliComparison => ({
      ...stimuliComparison,
      cueComponentConfigs: twoChoiceCueComponentConfig(config, CUE_NON_ARBITRARY.different, CUE_NON_ARBITRARY.iCannotKnow)
    }));

    this.trials = differentTrials.concat(idkTrials);
  }
}
