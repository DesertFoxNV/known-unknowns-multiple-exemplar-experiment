import { Block } from '../block/block';
import { StudyConfigWCase } from '../study-config-form/study-config';

export interface StudyConditions {
  blocks: Block[];
  config: StudyConfigWCase;
}
