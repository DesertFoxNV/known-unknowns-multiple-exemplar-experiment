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

/***
 * Represents an edge in the dictionary. Includes a source and a destination.
 */
export class Edge {

  readonly dest: Node;
  readonly src: Node;

  constructor(src: Node, dest: Node) {
    this.dest = dest;
    this.src = src;
  }

  toString(): string {
    return `${this.src}->${this.dest}`;
  }

}

/***
 * Represents an weighted edge in the dictionary. Includes a source and a destination.
 */
export class WeightedEdge extends Edge {

  readonly cue: string;

  constructor(src: Node, dest: Node, cue: string) {
    super(src, dest);
    this.cue = cue;
  }

  toString() {
    return `${this.src}->${this.dest} (${this.cue})`;
  }

}

/***
 * Represents a directed graph of Node and Edge objects
 */
export class DiGraph<T extends Edge> {
  private edges: Map<Node, T[]> = new Map<Node, T[]>();
  private nodes: Set<Node> = new Set();

  addEdge(edge: T) {
    const src = edge.src;
    const dest = edge.dest;
    if (!this.hasNode(src)) throw Error(`addEdge failed source node "${src.toString()}" is not in graph.`);
    if (!this.hasNode(dest)) throw Error(`addEdge failed destination node "${dest.toString()}" is not in graph.`);
    this.edges.set(edge.src, (this.edges.get(edge.src) as T[]).concat(edge));
  }

  addNode(node: Node): void {
    if (this.nodes.has(node)) throw Error(`addNode failed node "${node.toString()}" already exists`);
    this.nodes.add(node);
    this.edges.set(node, []);
  }

  getEdgesForNode(node: Node): T[]|undefined {
    return this.edges.get(node);
  }

  hasNode(node: Node): boolean {
    return this.nodes.has(node);
  }

  toString(): string {
    console.log(Array.from(this.edges.values()));
    return Array.from(this.edges.values())
      .flat()
      .filter(Boolean)
      .map((edge) => edge.toString()).join('\n');
  }

}

// TESTS

const graph = new DiGraph();
const nodeA = new Node('a');
const nodeB = new Node('b');
const nodeC = new Node('c');

graph.addNode(nodeA);
graph.addNode(nodeB);
graph.addNode(nodeC);

const edge1 = new WeightedEdge(nodeA, nodeB, 'GREATER THAN');
const edge2 = new WeightedEdge(nodeA, nodeC, 'LESS THAN');
const edge3 = new WeightedEdge(nodeB, nodeC, 'EQUAL TO');

graph.addEdge(edge1);
graph.addEdge(edge2);
graph.addEdge(edge3);

console.log(`edge1.toString() === "a->b (15, 10)"`, edge1.toString() === 'a->b (15, 10)');
console.log(`edge2.toString() === "a->c (14, 6)"`, edge2.toString() === 'a->c (14, 6)');
console.log(`edge3.toString() === "b->c (3, 1)"`, edge3.toString() === 'b->c (3, 1)');
console.log('');

const nodeNotInGraph = new Node('q');
const edgeNoSrc = new WeightedEdge(nodeNotInGraph, nodeB, 'SAME');
const edgeNoDest = new WeightedEdge(nodeA, nodeNotInGraph, 'SAME');

try {
  graph.addEdge(edgeNoSrc);
}
catch (e) {
  console.log('graph.addEdge(edgeNoSrc)',
    e.message === `addEdge failed source node "${edgeNoSrc.src.name}" is not in graph.`);
}

try {
  graph.addEdge(edgeNoDest);
}
catch (e) {
  console.log('graph.addEdge(edgeNoDest)',
    e.message === `addEdge failed destination node "${edgeNoDest.dest.name}" is not in graph.`);
}

console.log(`graph.toString()`, graph.toString() === `a->b (15, 10)\na->c (14, 6)\nb->c (3, 1)`, graph.toString());
