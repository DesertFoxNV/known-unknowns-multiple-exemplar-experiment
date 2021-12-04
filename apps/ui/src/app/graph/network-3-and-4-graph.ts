import { Inject, Injectable } from '@angular/core';
import { sample } from 'lodash-es';
import { CueNonArbitrary } from '../study-conditions/cue.constants';
import { getRandomStimulus } from '../study-conditions/get-random-stimuli';
import { StimulusCase } from '../study-conditions/stimulus-case';
import { STIMULUS_CASE } from '../study/study.module';
import {
  KNOWN_NETWORK_CUE_OPERATORS_SAME_GT_LT, TriNodeNetworkOperatorCombination
} from './known-network-cue-operators-same-gt-lt';
import { RelationType } from './relation-type';
import { RelationalEdge } from './relational-edge';
import { RelationalFrameGraph } from './relational-frame-graph';
import { RelationalFrameGraphConfig } from './relational-frame-graph-config';
import { RelationalNode } from './relational-node';
import { SAME_GT_LT_ICK_GRAPH_CONFIG } from './same-gt-lt-ick-graph-config';
import { UNKNOWN_NETWORK_CUE_OPERATORS_SAME_GT_LT } from './unknown-network-cue-operators-same-gt-lt';

@Injectable({
  providedIn: 'root'
})
export class Network3And4Graph extends RelationalFrameGraph {

  constructor(
    @Inject(STIMULUS_CASE) private stimulusCase: StimulusCase,
    @Inject(SAME_GT_LT_ICK_GRAPH_CONFIG) private relationalFrameGraphConfig: RelationalFrameGraphConfig
  ) {
    super(relationalFrameGraphConfig);

    // Include comparisons between networks
    this.includeRelationsBetweenNetworks = true;

    // Network 3 - known network
    const nodeA3 = new RelationalNode('A', 3, getRandomStimulus(stimulusCase));
    const nodeB3 = new RelationalNode('B', 3, getRandomStimulus(stimulusCase));
    const nodeC3 = new RelationalNode('C', 3, getRandomStimulus(stimulusCase));

    // Add nodes for network 3
    this.addNode(nodeA3);
    this.addNode(nodeB3);
    this.addNode(nodeC3);

    // Get randomized known network operator combination
    const [a3ToB3Relation, a3ToC3Relation, b3ToC3Relation] = sample(
      KNOWN_NETWORK_CUE_OPERATORS_SAME_GT_LT) as TriNodeNetworkOperatorCombination<CueNonArbitrary>;

    // Set A3 => B3 relation
    if (a3ToB3Relation) {
      this.addTrainedAndMutualRelations(new RelationalEdge(nodeA3, nodeB3, a3ToB3Relation, RelationType.trained));
    }

    // Set A3 => C3 relation
    if (a3ToC3Relation) {
      this.addTrainedAndMutualRelations(new RelationalEdge(nodeA3, nodeC3, a3ToC3Relation, RelationType.trained));
    }

    // Set B3 => C3 relation
    if (b3ToC3Relation) {
      this.addTrainedAndMutualRelations(new RelationalEdge(nodeB3, nodeC3, b3ToC3Relation, RelationType.trained));
    }

    // Network 2 - unknown network
    const nodeA4 = new RelationalNode('A', 4, getRandomStimulus(stimulusCase));
    const nodeB4 = new RelationalNode('B', 4, getRandomStimulus(stimulusCase));
    const nodeC4 = new RelationalNode('C', 4, getRandomStimulus(stimulusCase));

    // Add nodes for network 2
    this.addNode(nodeA4);
    this.addNode(nodeB4);
    this.addNode(nodeC4);

    // Get randomized unknown network operator combination
    const [a4ToB4Relation, a4ToC4Relation, b4ToC4Relation] = sample(
      UNKNOWN_NETWORK_CUE_OPERATORS_SAME_GT_LT) as TriNodeNetworkOperatorCombination<CueNonArbitrary>;

    // Set A4 => B4 relation
    if (a4ToB4Relation) {
      this.addTrainedAndMutualRelations(new RelationalEdge(nodeA4, nodeB4, a4ToB4Relation, RelationType.trained));
    }

    // Set A4 => C4 relation
    if (a4ToC4Relation) {
      this.addTrainedAndMutualRelations(new RelationalEdge(nodeA4, nodeC4, a4ToC4Relation, RelationType.trained));
    }

    // Set B4 => C4 relation
    if (b4ToC4Relation) {
      this.addTrainedAndMutualRelations(new RelationalEdge(nodeB4, nodeC4, b4ToC4Relation, RelationType.trained));
    }

  }

}
