import { shuffle } from 'lodash-es';
import { RelationalFrameGraph } from '../graph/relational-frame-graph';
import { StudyConfig, StudyConfigWCase } from '../study-config-form/study-config';
import { Block } from './block';
import { randomizedComponentConfigs } from './cue-component-configs';

export class TrainingNetworks extends Block {
  graph: RelationalFrameGraph;

  /**
   * Test Block
   *  Creates a test block with a known and unknown network.
   *  32 trials default (8 * numDuplicates trials)
   *    16 mutually entailed trials (default) = mutually-entailed (B:A, C:A) * numDuplicates (4 default) * 2 networks
   *    16 combinatorially entailed trials (default) = combinatorially-entailed (B:C, C:B) * numDuplicates  (4 default) * 2 networks
   * @param {StudyConfig} config
   * @param graph
   */
  constructor(
    config: StudyConfigWCase,
    graph: RelationalFrameGraph
  ) {
    super('Training Networks', config);
    this.graph = graph;
  }

  /**
   * Creates trials.
   * @returns {unknown[] | Array<Trial[][keyof Trial[]]>}
   */
  createTrials() {

    // Mutually entailed and combinatorially entailed trials are generated for each network
    this.trials = this.trials.concat([
        this.graph.identities,
        this.graph.trained,
        this.graph.combinatoriallyEntailed
      ].flat().map(
        stimuliComparison => ({ ...stimuliComparison, cueComponentConfigs: randomizedComponentConfigs(this.config) }))
    );

    console.log('create trials', this.trials);

    // The trials are shuffled to ensure random order.
    return shuffle(this.trials);
  }
}
