import { Trial } from '../trial/trial';

export abstract class Block {
  name: string;

  protected constructor(name: string) {
    this.name = name;
  }

  abstract nextTrial(): Trial|undefined
}
