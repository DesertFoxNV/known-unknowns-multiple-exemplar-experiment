import { Inject, Injectable } from '@angular/core';
import { getRandomStimulus } from '../study-conditions/get-random-stimuli';
import { StimulusCase } from '../study-conditions/stimulus-case';
import { STIMULUS_CASE } from '../study/study.module';
import { RelationType } from './relation-type';
import { RelationalEdge } from './relational-edge';
import { RelationalFrameGraph } from './relational-frame-graph';
import { RelationalFrameGraphConfig } from './relational-frame-graph-config';
import { RelationalNode } from './relational-node';
import { SAME_GT_LT_ICK_GRAPH_CONFIG } from './same-gt-lt-ick-graph-config';

@Injectable({
  providedIn: 'root'
})
export class Network5And6Graph extends RelationalFrameGraph {

  constructor(
    @Inject(STIMULUS_CASE) private stimulusCase: StimulusCase,
    @Inject(SAME_GT_LT_ICK_GRAPH_CONFIG) private relationalFrameGraphConfig: RelationalFrameGraphConfig
  ) {
    super(relationalFrameGraphConfig);

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
