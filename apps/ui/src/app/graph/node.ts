/**
 * Represents a node in a graph.
 */
export class Node {

  readonly name: string;

  constructor(name: string) {
    this.name = name;
  }

  /**
   * Returns a printable representation of the given object. When the result
   * from repr() is passed to eval(), we will get a copy of the original object
   * @returns {string}
   */
  repr(): string {
    return `new DigraphNode('${this.name}')`;
  }

  toString(): string {
    return this.name;
  }

}
