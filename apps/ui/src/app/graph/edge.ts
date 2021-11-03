import { Node } from './node';

/***
 * Represents an edge in the dictionary. Includes a source and a destination.
 */
export class Edge<N extends Node> {

  readonly dest: N;
  readonly src: N;

  constructor(src: N, dest: N) {
    this.dest = dest;
    this.src = src;
  }

  toString(): string {
    return `${this.src}->${this.dest}`;
  }

}
