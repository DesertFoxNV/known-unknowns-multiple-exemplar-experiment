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
  numDuplicates: number;

  /**
   * Test Block
   *  Creates a test block with a known and unknown network.
   *  32 trials default (8 * numDuplicates trials)
   *    16 mutually entailed trials (default) = mutually-entailed (B:A, C:A) * numDuplicates (4 default) * 2 networks
   *    16 combinatorially entailed trials (default) = combinatorially-entailed (B:C, C:B) * numDuplicates  (4 default) * 2 networks
   * @param {StudyConfig} config
   * @param numDuplicates the number of mutually entailed and combinatorially-entailed duplicates
   */
  constructor(
    config: StudyConfigWCase,
    numDuplicates = 4
  ) {
    super('Test', config);
    this.graph = this.createGraph(config);
    this.numDuplicates = numDuplicates;
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

    // Network 1 - known network
    const nodeA1 = new RelationalNode('A', 1, getRandomStimulus(config.stimulusCase));
    const nodeB1 = new RelationalNode('B', 1, getRandomStimulus(config.stimulusCase));
    const nodeC1 = new RelationalNode('C', 1, getRandomStimulus(config.stimulusCase));

    // Add nodes for network 1
    graph.addNode(nodeA1);
    graph.addNode(nodeB1);
    graph.addNode(nodeC1);

    // Get randomized known network operator combination
    const [a1ToB1Relation, a1ToC1Relation, b1ToC1Relation] = sample(
      KNOWN_NETWORK_CUE_OPERATORS_SAME_GT_LT) as TriNodeNetworkOperatorCombination<CueNonArbitrary>;

    // Set A1 => B1 relation
    if (a1ToB1Relation) {
      graph.addTrainedAndMutualRelations(new RelationalEdge(nodeA1, nodeB1, a1ToB1Relation, RelationType.trained));
    }

    // Set A1 => C1 relation
    if (a1ToC1Relation) {
      graph.addTrainedAndMutualRelations(new RelationalEdge(nodeA1, nodeC1, a1ToC1Relation, RelationType.trained));
    }

    // Set B1 => C1 relation
    if (b1ToC1Relation) {
      graph.addTrainedAndMutualRelations(new RelationalEdge(nodeB1, nodeC1, b1ToC1Relation, RelationType.trained));
    }

    console.log(graph.toString());

    // Network 2 - unknown network
    const nodeA2 = new RelationalNode('A', 2, getRandomStimulus(config.stimulusCase));
    const nodeB2 = new RelationalNode('B', 2, getRandomStimulus(config.stimulusCase));
    const nodeC2 = new RelationalNode('C', 2, getRandomStimulus(config.stimulusCase));

    // Add nodes for network 2
    graph.addNode(nodeA2);
    graph.addNode(nodeB2);
    graph.addNode(nodeC2);

    // Get randomized unknown network operator combination
    const [a2ToB2Relation, a2ToC2Relation, b2ToC2Relation] = sample(
      UNKNOWN_NETWORK_CUE_OPERATORS_SAME_GT_LT) as TriNodeNetworkOperatorCombination<CueNonArbitrary>;

    // Set A2 => B2 relation
    if (a2ToB2Relation) {
      graph.addTrainedAndMutualRelations(new RelationalEdge(nodeA2, nodeB2, a2ToB2Relation, RelationType.trained));
    }

    // Set A2 => C2 relation
    if (a2ToC2Relation) {
      graph.addTrainedAndMutualRelations(new RelationalEdge(nodeA2, nodeC2, a2ToC2Relation, RelationType.trained));
    }

    // Set B2 => C2 relation
    if (b2ToC2Relation) {
      graph.addTrainedAndMutualRelations(new RelationalEdge(nodeB2, nodeC2, b2ToC2Relation, RelationType.trained));
    }

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
