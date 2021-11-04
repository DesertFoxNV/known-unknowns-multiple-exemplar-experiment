import { Block } from '../block/block';
import { OperantChoiceBlock } from '../block/operant-choice-block';
import { TestBlock } from '../block/test-block';
import { StudyConfigWCase } from '../study-config-form/study-config';

export class StudyConditions {
  blocks: Block[] = [];
  config: StudyConfigWCase;

  constructor(config: StudyConfigWCase) {
    this.config = config;
    this.blocks = [
      // new TestBlock(config),
      // new ForcedChoiceBlock(config)
      new OperantChoiceBlock(config)
    ];
  }
}
