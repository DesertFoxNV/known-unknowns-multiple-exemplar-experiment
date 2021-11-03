import { cloneDeep } from 'lodash-es';
import { Digraph } from './digraph';
import { RelationType } from './relation-type';
import { RelationalEdge } from './relational-edge';
import { RelationalNode } from './relational-node';
import { StimuliComparison } from './stimuli-comparison';

export class RelationalFrameGraph extends Digraph<RelationalNode, RelationalEdge<RelationType>> {

  combinatorialDictionary: { [key: string]: { [key: string]: string }; };
  includeRelationsBetweenNetworks = false;
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
    const comparisons: StimuliComparison<RelationalNode>[] = [];
    const nodes = [...this.nodes];
    for (const startNode of nodes) {
      for (const endNode of nodes) {
        if (startNode === endNode) continue;
        if (!this.includeRelationsBetweenNetworks && startNode.network !== endNode.network) continue;
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

  get identities(): StimuliComparison<RelationalNode>[] {
    return [...this.nodes].map(node => ({
      relation: this.selfRelation,
      relationType: RelationType.identity,
      stimuli: [node, node]
    }));
  }

  get mutuallyEntailed(): StimuliComparison<RelationalNode>[] {
    return [...this.edges.values()].flat().filter(
      edge => edge.relationType === RelationType.mutuallyEntailed).map(
      edge => ({
        relation: edge.relation,
        relationType: edge.relationType,
        stimuli: [edge.src, edge.dest]
      }));
  }

  get trained(): StimuliComparison<RelationalNode>[] {
    return [...this.edges.values()].flat().filter(edge => edge.relationType === RelationType.trained).map(
      edge => ({
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
    if (!this.hasNode(dest)) throw Error(
      `Add edge failed destination node "${dest.toString()}" is not in graph.`);
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
    return ([] as StimuliComparison<RelationalNode>[]).concat(
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
