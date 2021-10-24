import {Block} from '../block/block';
import {DifferentIdkBlock} from '../block/different-idk-block';
import {BinaryNetwork} from '../network/binary-network';
import {StudyConfig} from '../study-config-form/study-config';
import {randomStimulusCase} from './random-stimulus-case';
import {StimulusCase} from './stimulus-case';
import {ForcedChoiceBlock} from "../block/forced-choice-block";

export class StudyConditions {
  blocks: Block[] = [];

  config: StudyConfig;

  stimulusCase: StimulusCase;

  constructor(config: StudyConfig) {
    this.stimulusCase = randomStimulusCase();
    this.config = config;
    const network3 = new BinaryNetwork(3, this.stimulusCase);
    const network4 = new BinaryNetwork(3, this.stimulusCase);
    this.blocks = [
      // new PreTestBlock(new KnownNetwork(1, this.stimulusCase), new KnownUnknownNetwork(2, this.stimulusCase),
      // new ForcedChoiceBlock(network3, config),
      new DifferentIdkBlock(network3, network4, config)
    ];
  }
}
