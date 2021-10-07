import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { StudyConfig } from '../study-config-form/study-config.interfaces';
import { StudyConfigService } from '../study-config-form/study-config.service';

@Component({
  selector: 'kumee-study',
  templateUrl: './study.component.html',
  styleUrls: ['./study.component.css']
})
export class StudyComponent {
  config: Observable<StudyConfig>;

  constructor(
    private studyConfigSvc: StudyConfigService
  ) {
    this.config = this.studyConfigSvc.getConfig();
  }

}
