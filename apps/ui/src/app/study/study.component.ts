import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { StudyConditionService } from '../study-conditions/study-condition.service';
import { StudyConfig } from '../study-config-form/study-config.interfaces';
import { StudyConfigService } from '../study-config-form/study-config.service';

@Component({
  selector: 'kumee-study',
  templateUrl: './study.component.html',
  styleUrls: ['./study.component.scss']
})
export class StudyComponent {
  config$: Observable<StudyConfig>;


  constructor(
    readonly studyConfigSvc: StudyConfigService,
    private studyConditionSvc: StudyConditionService
  ) {
    this.config$ = this.studyConfigSvc.config$();
    this.studyConditionSvc.createStudy();
  }

}
