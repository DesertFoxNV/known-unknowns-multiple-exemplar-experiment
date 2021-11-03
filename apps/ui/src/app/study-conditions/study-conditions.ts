import { Block } from '../block/block';
import { ForcedChoiceBlock } from '../block/forced-choice-block';
import { BinaryNetwork } from '../network/binary-network';
import { StudyConfigWCase } from '../study-config-form/study-config';

export class StudyConditions {
  blocks: Block[] = [];
  config: StudyConfigWCase;

  constructor(config: StudyConfigWCase) {
    this.config = config;
    const network3 = new BinaryNetwork(3, config.stimulusCase);
    const network4 = new BinaryNetwork(4, config.stimulusCase);
    this.blocks = [
      // new TestBlock(config)
      new ForcedChoiceBlock(config)
      // new OperantChoiceBlock(new KnownEqualityNetwork(5, this.stimulusCase), new KnownGreaterThanNetwork(6, this.stimulusCase),
      // config)
    ];
  }
}
