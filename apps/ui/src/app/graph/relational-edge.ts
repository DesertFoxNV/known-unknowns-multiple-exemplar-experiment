import { Edge } from './edge';
import { RelationType } from './relation-type';
import { RelationalNode } from './relational-node';

/***
 * Represents an weighted edge in the dictionary. Includes a source and a destination.
 */
export class RelationalEdge<T extends RelationType> extends Edge<RelationalNode> {

  readonly relation: string;
  readonly relationType: T;

  constructor(src: RelationalNode, dest: RelationalNode, relation: string, relationType: T) {
    super(src, dest);
    this.relation = relation;
    this.relationType = relationType;
  }

  toString() {
    return `${this.src} ${this.relation} ${this.dest} (${this.relationType})`;
  }

}
