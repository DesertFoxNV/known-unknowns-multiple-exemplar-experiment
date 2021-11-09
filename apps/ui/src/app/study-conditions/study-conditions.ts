import { Block } from '../block/block';
import { TestBlock } from '../block/test-block';
import { TrainingNetworks } from '../block/training-networks';
import { StudyConfigWCase } from '../study-config-form/study-config';

export class StudyConditions {
  blocks: Block[] = [];
  config: StudyConfigWCase;

  constructor(config: StudyConfigWCase) {
    const preTestBlock = new TestBlock(config);
    const network3And4Graph = preTestBlock.graph;
    this.config = config;
    this.blocks = [
      // preTestBlock,
      // new ForcedChoiceBlock(config)
      // new OperantChoiceBlock(config),
      new TrainingNetworks(config, network3And4Graph)
      // new TestBlock(config, network3And4Graph)
    ];
  }
}
