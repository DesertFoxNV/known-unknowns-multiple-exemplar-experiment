/**
 * Represents a node in a graph.
 */
import { cloneDeep } from 'lodash-es';

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

export class RelationalNode {
  readonly name: string;
  readonly network: number;
  readonly value: string;

  constructor(name: string, network: number, value = '') {
    this.name = name;
    this.network = network;
    this.value = value;
  }

  /**
   * Returns a printable representation of the given object. When the result
   * from repr() is passed to eval(), we will get a copy of the original object
   * @returns {string}
   */
  repr(): string {
    return `new RelationalFrameNode('${this.name}','${this.network}','${this.value}')`;
  }

  toString(): string {
    return `${this.name}${this.network}`;
  }
}

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

export enum RelationType {
  identity = 'identity',
  trained = 'trained',
  mutuallyEntailed = 'mutually entailed',
  combinatoriallyEntailed = 'combinatorially entailed'
}

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

/***
 * Represents a directed graph of Node and Edge objects
 */
export class DiGraph<N extends Node, E extends Edge<N>> {
  protected edges: Map<N, E[]> = new Map<N, E[]>();
  protected nodes: Set<N> = new Set();

  addEdge(edge: E) {
    const src = edge.src;
    const dest = edge.dest;
    if (!this.hasNode(src)) throw Error(`addEdge failed source node "${src.toString()}" is not in graph.`);
    if (!this.hasNode(dest)) throw Error(`addEdge failed destination node "${dest.toString()}" is not in graph.`);
    this.edges.set(edge.src, (this.edges.get(edge.src) as E[]).concat(edge));
  }

  addNode(node: N): void {
    if (this.nodes.has(node)) throw Error(`addNode failed node "${node.toString()}" already exists`);
    this.nodes.add(node);
    this.edges.set(node, []);
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

export interface StimuliComparisonGeneric {
  relation: string;
  relationType: string;
  stimuli: [RelationalNode, RelationalNode];
}

export class RelationalFrameGraph extends DiGraph<RelationalNode, RelationalEdge<RelationType>> {

  combinatorialDictionary: { [key: string]: { [key: string]: string }; };
  reverseDictionary: { [key: string]: string };
  selfRelation: string;
  unknownRelation: string;

  constructor(
    selfRelation: string,
    unknownRelation: string,
    reverseDictionary: { [key: string]: string },
    combinatorialDictionary: { [key: string]: { [key: string]: string }; }
  ) {
    super();
    this.selfRelation = selfRelation;
    this.unknownRelation = unknownRelation;
    this.reverseDictionary = reverseDictionary;
    this.combinatorialDictionary = combinatorialDictionary;
  }

  get combinatoriallyEntailed() {
    const comparisons: StimuliComparisonGeneric[] = [];
    const nodes = [...this.nodes];
    for (const startNode of nodes) {
      for (const endNode of nodes) {
        if (startNode === endNode) continue;
        if (this.getEdgesForNode(startNode).find(edge => edge.dest === endNode)) continue;
        const relations = this.findPathway(startNode, endNode)
          .map(path => path.edges.map(edge => edge.relation))
          .reduce((acc, relations, i) => {
            const relationsCopy = [...relations];

            let reducedRelation = relationsCopy.shift() as string;

            while (relationsCopy.length) {
              const relation = relationsCopy.shift() as string;
              reducedRelation = this.combinatorialDictionary[reducedRelation][relation];
            }

            acc.push(reducedRelation);

            relations.length = 0;

            return acc;
          }, [] as string[]);

        if (relations.length === 0) relations.push(this.unknownRelation);

        if ([...new Set(relations.filter(relation => relation !== this.unknownRelation))].length > 1) {
          console.warn(`Multiple relations detected for ${startNode.toString()} => ${endNode.toString()} comparison`,
            relations);
        } else {
          comparisons.push({
            relation: relations[0],
            relationType: RelationType.combinatoriallyEntailed,
            stimuli: [startNode, endNode]
          });
        }
      }
    }
    return comparisons;
  }

  get identities(): StimuliComparisonGeneric[] {
    return [...this.nodes].map(node => ({
      relation: this.selfRelation,
      relationType: RelationType.identity,
      stimuli: [node, node]
    }));
  }

  get mutuallyEntailed(): StimuliComparisonGeneric[] {
    return [...this.edges.values()].flat().filter(edge => edge.relationType === RelationType.mutuallyEntailed).map(
      edge => ({
        relation: edge.relation,
        relationType: edge.relationType,
        stimuli: [edge.src, edge.dest]
      }));
  }

  get trained(): StimuliComparisonGeneric[] {
    return [...this.edges.values()].flat().filter(edge => edge.relationType === RelationType.trained).map(edge => ({
      relation: edge.relation,
      relationType: edge.relationType,
      stimuli: [edge.src, edge.dest]
    }));
  }

  /**
   * Adds trained and mutually entailed relational edges
   * @param {RelationalEdge<RelationType.trained>} edge
   */
  addTrainedAndMutualRelations(edge: RelationalEdge<RelationType.trained>) {
    const src = edge.src;
    const dest = edge.dest;
    if (!this.hasNode(src)) throw Error(`Add edge failed source node "${src.toString()}" is not in graph.`);
    if (!this.hasNode(dest)) throw Error(`Add edge failed destination node "${dest.toString()}" is not in graph.`);
    if (!this.reverseDictionary?.[edge.relation]) throw Error(
      `Could not find inverse of relation ${edge.relation}`);
    if (this.edges.get(edge.src)?.some(e => e.src === src && e.dest === dest)) throw Error(
      `Add edge failed an edge already exists with src ${src.toString()} => dest ${dest.toString()}`);
    this.edges.set(edge.src, (this.edges.get(edge.src) as RelationalEdge<RelationType>[]).concat(edge));
    this.edges.set(edge.dest, (this.edges.get(edge.dest) as RelationalEdge<RelationType>[]).concat(
      new RelationalEdge(
        edge.dest,
        edge.src,
        this.reverseDictionary[edge.relation],
        RelationType.mutuallyEntailed)));
  }

  findPathway(
    startNode: RelationalNode,
    endNode: RelationalNode,
    edge?: RelationalEdge<RelationType>,
    path: { nodes: RelationalNode[], edges: RelationalEdge<RelationType>[] } = { nodes: [], edges: [] },
    paths: { nodes: RelationalNode[], edges: RelationalEdge<RelationType>[] }[] = []
  ): { nodes: RelationalNode[], edges: RelationalEdge<RelationType>[] }[] {
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

  toString(): string {
    return ([] as StimuliComparisonGeneric[]).concat(
        this.identities,
        this.trained,
        this.mutuallyEntailed,
        this.combinatoriallyEntailed
      )
      .flat()
      .map(
        (stimuliComparison) => `${stimuliComparison.relationType}: ${stimuliComparison.stimuli[0]} ${stimuliComparison.relation} ${stimuliComparison.stimuli[1]}`).join(
        '\n');
  }
}
