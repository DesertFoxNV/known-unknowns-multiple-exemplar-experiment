import { Block } from '../block/block';
import { ForcedChoiceBlock } from '../block/forced-choice-block';
import { OperantChoiceBlock } from '../block/operant-choice-block';
import { PreTestBlock } from '../block/pre-test-block';
import { BinaryNetwork } from '../network/binary-network';
import { KnownNetwork } from '../network/known-network';
import { KnownUnknownNetwork } from '../network/known-unknown-network';
import { StudyConfig } from '../study-config-form/study-config';
import { randomStimulusCase } from './random-stimulus-case';
import { StimulusCase } from './stimulus-case';

export class StudyConditions {
  blocks: Block[] = [];

  config: StudyConfig;

  stimulusCase: StimulusCase;

  constructor(config: StudyConfig) {
    this.stimulusCase = randomStimulusCase();
    this.config = config;
    const network3 = new BinaryNetwork(3, this.stimulusCase);
    const network4 = new BinaryNetwork(4, this.stimulusCase);
    this.blocks = [
      // new PreTestBlock(new KnownNetwork(1, this.stimulusCase), new KnownUnknownNetwork(2, this.stimulusCase), config),
      new ForcedChoiceBlock(new BinaryNetwork(3, this.stimulusCase), new BinaryNetwork(4, this.stimulusCase), config),
      // new OperantChoiceBlock(new KnownNetwork(5, this.stimulusCase), new KnownUnknownNetwork(6, this.stimulusCase), config)
    ];
  }
}
