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
