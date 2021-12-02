import { sample, shuffle } from 'lodash-es';
import { RelationalNode } from '../graph/relational-node';
import { BUTTON_TEXT_FILE_PATH, CueNonArbitrary } from '../study-conditions/cue.constants';
import { Trial } from '../trial/trial';

export function createColorTrial(): Trial {
  const color = sample(['red', 'green', 'blue']);
  if (!color) throw Error('Missing color in create color trial');
  return {
    relation: color,
    relationType: 'N/A',
    stimuli: [new RelationalNode('choose', 0, 'choose'), new RelationalNode(color, 0, color)],
    cueComponentConfigs: shuffle([
      {
        fileName: BUTTON_TEXT_FILE_PATH,
        isArbitrary: false,
        value: 'red' as CueNonArbitrary,
        viewValue: 'red'
      },
      {
        fileName: BUTTON_TEXT_FILE_PATH,
        isArbitrary: false,
        value: 'blue' as CueNonArbitrary,
        viewValue: 'blue'
      },
      {
        fileName: BUTTON_TEXT_FILE_PATH,
        isArbitrary: false,
        value: 'green' as CueNonArbitrary,
        viewValue: 'green'
      }
    ])
  };
}
