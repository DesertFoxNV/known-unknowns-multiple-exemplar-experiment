import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Block} from '../block/block';
import {StudyConfigService} from '../study-config-form/study-config.service';
import {StudyConditions} from './study-conditions';

@Injectable({
  providedIn: 'root'
})
export class StudyConditionService {
  conditions: StudyConditions | undefined;

  constructor(private configSvc: StudyConfigService) {
  }

  get trialTimeoutSeconds() {
    if (!this.conditions) throw Error('conditions not defined')
    return this.conditions.config.trialTimeoutSeconds;
  }

  blocks$(): Observable<Block[]> {
    return this.configSvc.config$().pipe(
      map(config => {
        this.conditions = new StudyConditions(config);
        return this.conditions.blocks;
      })
    );
  }
}
