import { clone, sample } from 'lodash-es';
import { getRandomStimuli } from './get-random-stimuli';
import { StimulusCase } from './stimulus-case';

export enum OperatorType {
  equal = '=',
  lessThan = '<',
  greaterThan = '>',
  unknown = '?'
}

// Functions as a tuple dictionary to obtain the correct operator for the B to C comparison.
const OPERATOR_B_TO_C_COMPARISON: Map<string, OperatorType> = new Map([
  [[OperatorType.equal, OperatorType.equal].join(','), OperatorType.equal],
  [[OperatorType.equal, OperatorType.greaterThan].join(','), OperatorType.greaterThan],
  [[OperatorType.equal, OperatorType.lessThan].join(','), OperatorType.lessThan],
  [[OperatorType.lessThan, OperatorType.equal].join(','), OperatorType.greaterThan],
  [[OperatorType.lessThan, OperatorType.greaterThan].join(','), OperatorType.greaterThan],
  [[OperatorType.greaterThan, OperatorType.equal].join(','), OperatorType.lessThan],
  [[OperatorType.greaterThan, OperatorType.lessThan].join(','), OperatorType.lessThan],
  [[OperatorType.lessThan, OperatorType.lessThan].join(','), OperatorType.unknown],
  [[OperatorType.greaterThan, OperatorType.greaterThan].join(','), OperatorType.unknown]
]);

export abstract class Network {

  num: number;
  selectedOperators: [OperatorType, OperatorType];
  stimuli: [string, string, string];

  protected constructor(
    num: number,
    stimulusCase: StimulusCase,
    operatorOptions: [OperatorType, OperatorType][]
  ) {
    this.num = num;
    this.stimuli = getRandomStimuli(3, stimulusCase) as [string, string, string];
    this.selectedOperators = sample(operatorOptions) as [OperatorType, OperatorType];
  }

  get combinatoriallyEntailed(): StimuliComparison[] {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [A, B, C] = this.stimuli;
    const comparisonBToC = {
      stimuli: [B, C] as [string, string],
      operator: OPERATOR_B_TO_C_COMPARISON.get(this.selectedOperators.join(',')) as OperatorType
    };
    return [
      comparisonBToC,
      {
        stimuli: clone(comparisonBToC.stimuli).reverse() as [string, string],
        operator: OPPOSITE_OPERATOR_TYPES[comparisonBToC.operator]
      }
    ];
  }

  get identities(): StimuliComparison[] {
    return this.stimuli.map(stimulus => {
      return {
        stimuli: [stimulus, stimulus],
        operator: OperatorType.equal
      };
    });
  }

  get mutuallyEntailed(): StimuliComparison[] {
    return this.trained.map(({ stimuli, operator }) => ({
      stimuli: clone(stimuli).reverse() as [string, string],
      operator: OPPOSITE_OPERATOR_TYPES[operator]
    }));
  }

  get trained(): StimuliComparison[] {
    const [A, B, C] = this.stimuli;
    return [
      {
        stimuli: [A, B],
        operator: this.selectedOperators[0]
      },
      {
        stimuli: [A, C],
        operator: this.selectedOperators[1]
      }
    ];
  }

  comparisonToString(comparison: StimuliComparison[]): string {
    return comparison.map(
      ({ stimuli: [stimulus1, stimulus2], operator }) => `${stimulus1} ${operator} ${stimulus2}`).join(', ');
  }

  toString(): string {
    return [
      `Network ${this.num}`,
      this.stimuli.map((stimulus, i) => `${String.fromCharCode(65 + i)}${this.num} = ${this.stimuli[i]}`).join(', '),
      `Identities: ${this.comparisonToString(this.identities)}`,
      `Trained: ${this.comparisonToString(this.trained)}`,
      `Mutually Entailed: ${this.comparisonToString(this.mutuallyEntailed)}`,
      `Combinatorially Entailed: ${this.comparisonToString(this.combinatoriallyEntailed)}`
    ].join('\n');
  }
}

export interface StimuliComparison {
  operator: OperatorType
  stimuli: [string, string],
}

export const OPPOSITE_OPERATOR_TYPES: Record<OperatorType, OperatorType> = {
  [OperatorType.equal]: OperatorType.equal,
  [OperatorType.lessThan]: OperatorType.greaterThan,
  [OperatorType.greaterThan]: OperatorType.lessThan,
  [OperatorType.unknown]: OperatorType.unknown
};

export class FullySpecifiedNetwork extends Network {

  constructor(num: number, stimulusCase: StimulusCase) {
    super(num, stimulusCase, [
      [OperatorType.equal, OperatorType.equal],
      [OperatorType.equal, OperatorType.greaterThan],
      [OperatorType.equal, OperatorType.lessThan],
      [OperatorType.lessThan, OperatorType.equal],
      [OperatorType.lessThan, OperatorType.greaterThan],
      [OperatorType.greaterThan, OperatorType.equal],
      [OperatorType.greaterThan, OperatorType.lessThan]
    ]);
  }
}

export class KnownUnknownNetwork extends Network {

  constructor(num: number, stimulusCase: StimulusCase) {
    super(num, stimulusCase, [
      [OperatorType.lessThan, OperatorType.lessThan],
      [OperatorType.greaterThan, OperatorType.greaterThan]
    ]);
  }
}
