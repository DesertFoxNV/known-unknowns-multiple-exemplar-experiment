import { AfterViewInit, Component, EventEmitter, Output, QueryList, ViewChildren } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { shuffle } from 'lodash-es';
import { interval, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { StudyConditionService } from '../study-conditions/study-condition.service';
import { StudyConditions } from '../study-conditions/study-conditions';
import { TrialCueComponentConfig } from '../study-conditions/trial-cue-component-config';
import { nextTick } from './next-tick';
import { Trial } from './trial';
import { TrialCueComponent } from './trial-cue/trial-cue.component';
import { TrialStimulusComponent } from './trial-stimulus/trial-stimulus.component';

@UntilDestroy()
@Component({
  selector: 'trial',
  templateUrl: './trial.component.html',
  styleUrls: ['./trial.component.scss']
})
export class TrialComponent implements AfterViewInit {
  @Output() completed = new EventEmitter<{ cue: TrialCueComponentConfig, position: number }|undefined>();
  conditions: StudyConditions;
  cueComponentConfigs: TrialCueComponentConfig[] = [];
  secondsInTrial = 0;
  @Output() timedOut = new EventEmitter();
  timerSub: Subscription|undefined;
  @ViewChildren(TrialCueComponent) trialCueComponents!: QueryList<TrialCueComponent>;
  @ViewChildren(TrialStimulusComponent) trialStimulusComponents!: QueryList<TrialStimulusComponent>;

  constructor(private conditionSvc: StudyConditionService) {
    this.conditions = this.conditionSvc.conditions as StudyConditions;
  }

  async next(trial: Trial) {
    this.cueComponentConfigs = [...this.conditions.cueComponentConfigs];

    this.setTimer();

    await nextTick();

    for (const [i, value] of trial.stimuli.entries()) this.trialStimulusComponents.get(i)?.set(value);
    const shuffledCueConfigs = shuffle(this.conditions.cueComponentConfigs);
    for (let i = 0; i < this.trialCueComponents.length; i++) this.trialCueComponents.get(i)?.set(shuffledCueConfigs[i]);
  };

  ngAfterViewInit(): void {
    this.trialCueComponents.changes.pipe(untilDestroyed(this)).subscribe();
    this.trialStimulusComponents.changes.pipe(untilDestroyed(this)).subscribe();
  }

  setTimer() {
    if (this.timerSub) this.timerSub.unsubscribe();
    this.secondsInTrial = 0;
    this.timerSub = interval(1000).pipe(
      tap(() => {
        this.secondsInTrial++;
        if (this.secondsInTrial >= this.conditions.config.trialTimeout) this.timedOut.emit();
      }),
      untilDestroyed(this)
    ).subscribe();
  }
}
