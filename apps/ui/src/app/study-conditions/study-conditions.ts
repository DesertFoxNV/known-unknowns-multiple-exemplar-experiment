import { Block } from '../block/block';
import { PreTestBlock } from '../block/pre-test-block';
import { FullySpecifiedNetwork } from '../network/fully-specified-network';
import { KnownUnknownNetwork } from '../network/known-unknown-network';
import { Network } from '../network/network';
import { StudyConfig } from '../study-config-form/study-config';
import { randomStimulusCase } from './random-stimulus-case';
import { StimulusCase } from './stimulus-case';

export class StudyConditions {
  blocks: Block[] = [];
  config: StudyConfig;
  networks = new Map<number, Network>([]);
  stimulusCase: StimulusCase;

  constructor(config: StudyConfig) {
    const stimulusCase = randomStimulusCase();

    this.config = config;

    this.networks.set(1, new FullySpecifiedNetwork(1, stimulusCase));
    this.networks.set(2, new KnownUnknownNetwork(2, stimulusCase));

    this.blocks = [
      new PreTestBlock(this.networks.get(1) as Network, this.networks.get(2) as Network, config)
    ];

    this.stimulusCase = stimulusCase;
  }
}
