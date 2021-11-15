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
export class Network1And2Graph extends RelationalFrameGraph {
  constructor(
    @Inject(STIMULUS_CASE) private stimulusCase: StimulusCase,
    @Inject(SAME_GT_LT_ICK_GRAPH_CONFIG) private relationalFrameGraphConfig: RelationalFrameGraphConfig
  ) {
    super(relationalFrameGraphConfig);
    this.includeRelationsBetweenNetworks = true;

    // Network 1 - known network
    const nodeA1 = new RelationalNode('A', 1, getRandomStimulus(stimulusCase));
    const nodeB1 = new RelationalNode('B', 1, getRandomStimulus(stimulusCase));
    const nodeC1 = new RelationalNode('C', 1, getRandomStimulus(stimulusCase));

    // Add nodes for network 1
    this.addNode(nodeA1);
    this.addNode(nodeB1);
    this.addNode(nodeC1);

    // Set A1 => B1 relation
    this.addEdge(new RelationalEdge(nodeA1, nodeB1, 'different', RelationType.trained));
    this.addEdge(new RelationalEdge(nodeA1, nodeC1, 'different', RelationType.trained));
    this.addEdge(new RelationalEdge(nodeB1, nodeA1, 'different', RelationType.trained));
    this.addEdge(new RelationalEdge(nodeB1, nodeC1, 'different', RelationType.trained));
    this.addEdge(new RelationalEdge(nodeC1, nodeA1, 'different', RelationType.trained));
    this.addEdge(new RelationalEdge(nodeC1, nodeB1, 'different', RelationType.trained));

    // Network 2 - unknown network
    const nodeD = new RelationalNode('D', 2, getRandomStimulus(stimulusCase));
    const nodeE = new RelationalNode('E', 2, getRandomStimulus(stimulusCase));
    const nodeF = new RelationalNode('F', 2, getRandomStimulus(stimulusCase));

    // Add nodes for network 2
    this.addNode(nodeD);
    this.addNode(nodeE);
    this.addNode(nodeF);
  }
}
