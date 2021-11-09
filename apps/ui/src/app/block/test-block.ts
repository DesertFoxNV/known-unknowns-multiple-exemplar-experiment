import { sample, shuffle } from 'lodash-es';
import {
  KNOWN_NETWORK_CUE_OPERATORS_SAME_GT_LT, TriNodeNetworkOperatorCombination
} from '../graph/known-network-cue-operators-same-gt-lt';
import {
  COMBINATORIALLY_ENTAILED_DICTIONARY_SAME_GT_LT_ICK, MUTUALLY_ENTAILED_DICTIONARY_SAME_GT_LT_ICK
} from '../graph/operator-dictionaries';
import { RelationType } from '../graph/relation-type';
import { RelationalEdge } from '../graph/relational-edge';
import { RelationalFrameGraph } from '../graph/relational-frame-graph';
import { RelationalNode } from '../graph/relational-node';
import { UNKNOWN_NETWORK_CUE_OPERATORS_SAME_GT_LT } from '../graph/unknown-network-cue-operators-same-gt-lt';
import { CueNonArbitrary } from '../study-conditions/cue.constants';
import { getRandomStimulus } from '../study-conditions/get-random-stimuli';
import { StudyConfig, StudyConfigWCase } from '../study-config-form/study-config';
import { Block } from './block';
import { randomizedComponentConfigs } from './cue-component-configs';

export class TestBlock extends Block {
  graph: RelationalFrameGraph;
  numDuplicates = 4;

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
    graph?: RelationalFrameGraph
  ) {
    super('Test', config);
    this.graph = graph || this.createGraph(config);
  }

  /**
   * Creates relational graph
   * @param {StudyConfigWCase} config
   * @returns {RelationalFrameGraph}
   */
  createGraph(config: StudyConfigWCase) {
    const graph = new RelationalFrameGraph(
      'same',
      'iCannotKnow',
      MUTUALLY_ENTAILED_DICTIONARY_SAME_GT_LT_ICK,
      COMBINATORIALLY_ENTAILED_DICTIONARY_SAME_GT_LT_ICK);

    // Network 3 - known network
    const nodeA3 = new RelationalNode('A', 3, getRandomStimulus(config.stimulusCase));
    const nodeB3 = new RelationalNode('B', 3, getRandomStimulus(config.stimulusCase));
    const nodeC3 = new RelationalNode('C', 3, getRandomStimulus(config.stimulusCase));

    // Add nodes for network 1
    graph.addNode(nodeA3);
    graph.addNode(nodeB3);
    graph.addNode(nodeC3);

    // Get randomized known network operator combination
    const [a3ToB3Relation, a3ToC3Relation, b3ToC3Relation] = sample(
      KNOWN_NETWORK_CUE_OPERATORS_SAME_GT_LT) as TriNodeNetworkOperatorCombination<CueNonArbitrary>;

    // Set A3 => B3 relation
    if (a3ToB3Relation) {
      graph.addTrainedAndMutualRelations(new RelationalEdge(nodeA3, nodeB3, a3ToB3Relation, RelationType.trained));
    }

    // Set A3 => C3 relation
    if (a3ToC3Relation) {
      graph.addTrainedAndMutualRelations(new RelationalEdge(nodeA3, nodeC3, a3ToC3Relation, RelationType.trained));
    }

    // Set B3 => C3 relation
    if (b3ToC3Relation) {
      graph.addTrainedAndMutualRelations(new RelationalEdge(nodeB3, nodeC3, b3ToC3Relation, RelationType.trained));
    }

    // Network 2 - unknown network
    const nodeA4 = new RelationalNode('A', 4, getRandomStimulus(config.stimulusCase));
    const nodeB4 = new RelationalNode('B', 4, getRandomStimulus(config.stimulusCase));
    const nodeC4 = new RelationalNode('C', 4, getRandomStimulus(config.stimulusCase));

    // Add nodes for network 2
    graph.addNode(nodeA4);
    graph.addNode(nodeB4);
    graph.addNode(nodeC4);

    // Get randomized unknown network operator combination
    const [a4ToB4Relation, a4ToC4Relation, b4ToC4Relation] = sample(
      UNKNOWN_NETWORK_CUE_OPERATORS_SAME_GT_LT) as TriNodeNetworkOperatorCombination<CueNonArbitrary>;

    // Set A4 => B4 relation
    if (a4ToB4Relation) {
      graph.addTrainedAndMutualRelations(new RelationalEdge(nodeA4, nodeB4, a4ToB4Relation, RelationType.trained));
    }

    // Set A4 => C4 relation
    if (a4ToC4Relation) {
      graph.addTrainedAndMutualRelations(new RelationalEdge(nodeA4, nodeC4, a4ToC4Relation, RelationType.trained));
    }

    // Set B4 => C4 relation
    if (b4ToC4Relation) {
      graph.addTrainedAndMutualRelations(new RelationalEdge(nodeB4, nodeC4, b4ToC4Relation, RelationType.trained));
    }

    console.log(graph.toString());

    return graph;
  }

  /**
   * Creates trials.
   * @returns {unknown[] | Array<Trial[][keyof Trial[]]>}
   */
  createTrials() {

    // Mutually entailed and combinatorially entailed trials are generated for each network
    for (let i = 0; i < this.numDuplicates; i++) {
      this.trials = this.trials.concat([
          this.graph.mutuallyEntailed,
          this.graph.combinatoriallyEntailed
        ].flat().map(
          stimuliComparison => ({ ...stimuliComparison, cueComponentConfigs: randomizedComponentConfigs(this.config) }))
      );
    }

    // The trials are shuffled to ensure random order.
    return shuffle(this.trials);
  }
}
