import { Component } from '@angular/core';
import { RelationalEdge, RelationalFrameGraph, RelationalNode, RelationType } from '../block/digraph';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor() {
    const combDict: { [key: string]: { [key: string]: string } } = {
      greaterThan: {
        same: 'greaterThan',
        greaterThan: 'greaterThan',
        lessThan: 'iCannotKnow',
        iCannotKnow: 'iCannotKnow'
      },
      lessThan: {
        same: 'lessThan',
        greaterThan: 'iCannotKnow',
        lessThan: 'lessThan',
        iCannotKnow: 'iCannotKnow'
      },
      same: {
        same: 'same',
        greaterThan: 'greaterThan',
        lessThan: 'lessThan',
        iCannotKnow: 'iCannotKnow'
      },
      iCannotKnow: {
        same: 'iCannotKnow',
        greaterThan: 'iCannotKnow',
        lessThan: 'iCannotKnow',
        iCannotKnow: 'iCannotKnow'
      }
    };
    const graph = new RelationalFrameGraph(
      'same',
      'iCannotKnow',
      {
        same: 'same',
        lessThan: 'greaterThan',
        greaterThan: 'lessThan',
        iCannotKnow: 'iCannotKnow'
      },
      combDict);

    const nodeA1 = new RelationalNode('A', 1);
    const nodeB1 = new RelationalNode('B', 1);
    const nodeC1 = new RelationalNode('C', 1);
    const nodeA2 = new RelationalNode('A', 2);
    const nodeB2 = new RelationalNode('B', 2);
    const nodeC2 = new RelationalNode('C', 2);

    graph.addNode(nodeA1);
    graph.addNode(nodeB1);
    graph.addNode(nodeC1);
    graph.addNode(nodeA2);
    graph.addNode(nodeB2);
    graph.addNode(nodeC2);

    graph.addTrainedAndMutualRelations(new RelationalEdge(nodeA1, nodeB1, 'same', RelationType.trained));
    graph.addTrainedAndMutualRelations(new RelationalEdge(nodeB1, nodeC1, 'same', RelationType.trained));
    graph.addTrainedAndMutualRelations(new RelationalEdge(nodeA1, nodeC1, 'same', RelationType.trained));

    graph.addTrainedAndMutualRelations(new RelationalEdge(nodeA2, nodeB2, 'greaterThan', RelationType.trained));
    graph.addTrainedAndMutualRelations(new RelationalEdge(nodeB2, nodeC2, 'greaterThan', RelationType.trained));
    // graph.addTrainedAndMutualRelations(new RelationalEdge(nodeC2, nodeB2, 'greaterThan', RelationType.trained));


    graph.addTrainedAndMutualRelations(new RelationalEdge(nodeA1, nodeA2, 'same', RelationType.trained));

    console.log(graph.toString());

    // const pathRelationSets = graph.findPathway(nodeA, nodeC)
    //   .map(path => {
    //     console.log(path)
    //   })

    // graph.validate();

  }
}


