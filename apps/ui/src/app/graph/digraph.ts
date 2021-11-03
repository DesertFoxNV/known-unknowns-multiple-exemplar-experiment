import { cloneDeep } from 'lodash-es';
import { Edge } from './edge';
import { Node } from './node';

/***
 * Represents a directed graph of Node and Edge objects
 */
export class Digraph<N extends Node, E extends Edge<N>> {
  edges: Map<N, E[]> = new Map<N, E[]>();
  nodes: Set<N> = new Set();

  addEdge(edge: E) {
    const src = edge.src;
    const dest = edge.dest;
    if (!this.hasNode(src)) throw Error(`addEdge failed source node "${src.toString()}" is not in graph.`);
    if (!this.hasNode(dest)) throw Error(`addEdge failed destination node "${dest.toString()}" is not in graph.`);
    if (this.edges.get(edge.src)?.some(e => e.src === src && e.dest === dest)) throw Error(
      `Add edge failed an edge already exists with src ${src.toString()} => dest ${dest.toString()}`);
    this.edges.set(edge.src, (this.edges.get(edge.src) as E[]).concat(edge));
  }

  addNode(node: N): void {
    if (this.nodes.has(node)) throw Error(`addNode failed node "${node.toString()}" already exists`);
    this.nodes.add(node);
    this.edges.set(node, []);
  }

  findPathway(
    startNode: N,
    endNode: N,
    edge?: E,
    path: { nodes: N[], edges: E[] } = { nodes: [], edges: [] },
    paths: { nodes: N[], edges: E[] }[] = []
  ): { nodes: N[], edges: E[] }[] {
    path.nodes = path.nodes.concat(startNode);
    if (edge) path.edges = path.edges.concat(edge);
    if (startNode === endNode) {
      return paths.concat(path);
    } else {
      for (const edge of this.getEdgesForNode(startNode)) {

        if (!path.nodes.map(node => node.toString()).includes(edge.dest.toString()))  // Avoid cycles
        {
          const newPath = this.findPathway(edge.dest, endNode, edge, cloneDeep(path), paths);
          if (newPath) paths = paths.concat(newPath);
        }
      }
      return paths;
    }
  }

  getEdgesForNode(node: N): E[] {
    return this.edges.get(node) || [];
  }

  hasNode(node: N): boolean {
    return this.nodes.has(node);
  }

  toString(): string {
    return Array.from(this.edges.values())
      .flat()
      .filter(Boolean)
      .map((edge) => edge.toString()).join('\n');
  }

}
