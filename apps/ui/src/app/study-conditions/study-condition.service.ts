import { Injectable } from '@angular/core';
import { StudyConfigService } from '../study-config-form/study-config.service';
import { StudyConditions } from './study-conditions';

@Injectable({
  providedIn: 'root'
})
export class StudyConditionService {
  conditions: StudyConditions|undefined;

  constructor(private configSvc: StudyConfigService) {
  }

  get trialTimeoutSeconds() {
    if (!this.conditions) throw Error('conditions not defined');
    return this.conditions.config.trialTimeoutSeconds;
  }

  // blocks$(): Observable<Block[]> {
  //   return this.configSvc.config.pipe(
  //     map(config => {
  //       const preTestBlock = new TestBlock(config);
  //       const network3And4Graph = preTestBlock.graph;
  //       this.conditions = {
  //         blocks: [
  //           preTestBlock,
  //           new ForcedChoiceBlock(config),
  //           new OperantChoiceBlock(config),
  //           new TrainingNetworks(config, network3And4Graph)
  //         ],
  //         config
  //       };
  //       return this.conditions.blocks;
  //     })
  //   );
  // }
}
