import { Block } from '../block/block';
import { ForcedChoiceBlock } from '../block/forced-choice-block';
import { TestBlock } from '../block/test-block';
import {
  COMBINATORIALLY_ENTAILED_DICTIONARY_SAME_GT_LT_ICK, MUTUALLY_ENTAILED_DICTIONARY_SAME_GT_LT_ICK
} from '../graph/operator-dictionaries';
import { RelationType } from '../graph/relation-type';
import { RelationalEdge } from '../graph/relational-edge';
import { RelationalFrameDigraph } from '../graph/relational-frame-digraph';
import { RelationalNode } from '../graph/relational-node';
import { BinaryNetwork } from '../network/binary-network';
import { StudyConfig, StudyConfigWCase } from '../study-config-form/study-config';
import { randomStimulusCase } from './random-stimulus-case';
import { StimulusCase } from './stimulus-case';

export class StudyConditions {
  blocks: Block[] = [];
  config: StudyConfigWCase;

  constructor(config: StudyConfigWCase) {
    this.config = config;
    const network3 = new BinaryNetwork(3, config.stimulusCase);
    const network4 = new BinaryNetwork(4, config.stimulusCase);
    this.blocks = [
      // new TestBlock(config)
      new ForcedChoiceBlock(config),
      // new OperantChoiceBlock(new KnownEqualityNetwork(5, this.stimulusCase), new KnownGreaterThanNetwork(6, this.stimulusCase),
      // config)
    ];
  }
}
