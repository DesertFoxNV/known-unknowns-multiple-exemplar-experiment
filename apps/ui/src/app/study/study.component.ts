import { Component, OnInit, ViewChild } from '@angular/core';
import { sample } from 'lodash-es';
import { delay, tap } from 'rxjs/operators';
import { getRandomStimuli } from '../study-conditions/get-random-stimuli';
import { StudyConditions } from '../study-conditions/study-conditions';
import { StudyConfig } from '../study-config-form/study-config.interfaces';
import { StudyConfigService } from '../study-config-form/study-config.service';
import { Trial } from '../trial/trial';
import { TrialComponent } from '../trial/trial.component';

@Component({
  selector: 'study',
  templateUrl: './study.component.html',
  styleUrls: ['./study.component.scss']
})
export class StudyComponent implements OnInit {
  config: StudyConfig|undefined;
  studyConditions: StudyConditions|undefined;
  @ViewChild(TrialComponent, { static: false }) trialComponent: TrialComponent|undefined;
  trials: Trial[] = [];

  constructor(
    readonly studyConfigSvc: StudyConfigService
  ) {
  }

  logButtonClicked($event: unknown) {
    console.log($event);
    this.nextTrial();
  }

  nextTrial() {
    this?.trialComponent?.next(sample(this.trials) as Trial);
  }

  ngOnInit(): void {
    this.studyConfigSvc.config$().pipe(
      tap(config => {
        this.studyConditions = new StudyConditions(config);

        const options = getRandomStimuli(50, this.studyConditions.stimulusCase);
        while (options.length >= 2) {
          this.trials.push({
            stimuli: [
              options.pop() as string,
              options.pop() as string
            ]
          });
        }
      }),
      delay(0),
      tap(() => this.nextTrial())
    ).subscribe();
  }

  reload() {
    location.reload();
  }

}