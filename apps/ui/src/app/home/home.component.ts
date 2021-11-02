import { Component } from '@angular/core';
import { Node, RelationalEdge, RelationalFrameGraph, RelationType } from '../block/digraph';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor() {
    const graph = new RelationalFrameGraph('same', 'iCannotKnow', {
      same: 'same',
      lessThan: 'greaterThan',
      greaterThan: 'lessThan',
      iCannotKnow: 'iCannotKnow'
    });

    const nodeA = new Node('A');
    const nodeB = new Node('B');
    const nodeC = new Node('C');

    graph.addNode(nodeA);
    graph.addNode(nodeB);
    graph.addNode(nodeC);

    graph.addTrainedAndMutualRelations(new RelationalEdge(nodeA, nodeB, 'same', RelationType.trained));
    graph.addTrainedAndMutualRelations(new RelationalEdge(nodeA, nodeC, 'same', RelationType.trained));

    // console.log(graph.toString());
    // console.log(graph.identities);
    // console.log(graph.trained);

    console.log('pathways', graph.findPathway(nodeB, nodeC))
  }
}


