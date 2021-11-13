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
export class Network5And6Graph extends RelationalFrameGraph {

  constructor(
    @Inject(STIMULUS_CASE) private stimulusCase: StimulusCase,
    @Inject(SAME_GT_LT_ICK_GRAPH_CONFIG) private relationalFrameGraphConfig: RelationalFrameGraphConfig
  ) {
    super(relationalFrameGraphConfig);

    // TODO: This need to be set within the block
    // this.includeRelationsBetweenNetworks = iCannotKnow;
    this.includeRelationsBetweenNetworks = true;

    // Network 1 - known network
    const nodeA1 = new RelationalNode('A', 5, getRandomStimulus(stimulusCase));
    const nodeB1 = new RelationalNode('B', 5, getRandomStimulus(stimulusCase));
    const nodeC1 = new RelationalNode('C', 5, getRandomStimulus(stimulusCase));

    // Add nodes for network 1
    this.addNode(nodeA1);
    this.addNode(nodeB1);
    this.addNode(nodeC1);

    // Set A1 = B1 = C1
    this.addTrainedAndMutualRelations(new RelationalEdge(nodeA1, nodeB1, 'same', RelationType.trained));
    this.addTrainedAndMutualRelations(new RelationalEdge(nodeA1, nodeC1, 'same', RelationType.trained));
    this.addTrainedAndMutualRelations(new RelationalEdge(nodeB1, nodeC1, 'same', RelationType.trained));

    // Network 2 - A2 > B2 > C2
    const nodeA2 = new RelationalNode('A', 6, getRandomStimulus(stimulusCase));
    const nodeB2 = new RelationalNode('B', 6, getRandomStimulus(stimulusCase));
    const nodeC2 = new RelationalNode('C', 6, getRandomStimulus(stimulusCase));

    // Add nodes for network 2
    this.addNode(nodeA2);
    this.addNode(nodeB2);
    this.addNode(nodeC2);

    // Set A2 > B2 > C2
    this.addTrainedAndMutualRelations(new RelationalEdge(nodeA2, nodeB2, 'greaterThan', RelationType.trained));
    this.addTrainedAndMutualRelations(new RelationalEdge(nodeA2, nodeC2, 'greaterThan', RelationType.trained));
    this.addTrainedAndMutualRelations(new RelationalEdge(nodeB2, nodeC2, 'greaterThan', RelationType.trained));
  }

}
