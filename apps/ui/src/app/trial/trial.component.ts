import {AfterViewInit, Component, EventEmitter, Output, QueryList, ViewChildren} from '@angular/core';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {shuffle} from 'lodash-es';
import {interval, Subscription} from 'rxjs';
import {takeWhile, tap} from 'rxjs/operators';
import {StudyConditionService} from '../study-conditions/study-condition.service';
import {TrialCueComponentConfig} from '../study-conditions/trial-cue-component-config';
import {Trial} from './trial';
import {TrialCueComponent} from './trial-cue/trial-cue.component';
import {TrialStimulusComponent} from './trial-stimulus/trial-stimulus.component';

@UntilDestroy()
@Component({
  selector: 'trial',
  templateUrl: './trial.component.html',
  styleUrls: ['./trial.component.scss']
})
export class TrialComponent implements AfterViewInit {
  @Output() completed = new EventEmitter<{ cue: TrialCueComponentConfig, position: number } | undefined>();
  secondsInTrial = 0;
  timerSub: Subscription | undefined;
  @ViewChildren(TrialCueComponent) trialCueComponents!: QueryList<TrialCueComponent>;
  @ViewChildren(TrialStimulusComponent) trialStimulusComponents!: QueryList<TrialStimulusComponent>;

  constructor(private conditionSvc: StudyConditionService) {
  }

  next(trial: Trial) {
    this.setTimer();

    for (const [i, value] of trial.stimuli.entries()) this.trialStimulusComponents.get(i)?.set(value);
    const shuffledCueConfigs = shuffle(trial.cueComponentConfigs);
    for (let i = 0; i < this.trialCueComponents.length; i++) this.trialCueComponents.get(i)?.set(shuffledCueConfigs[i]);
  };

  ngAfterViewInit(): void {
    this.trialCueComponents.changes.pipe(untilDestroyed(this)).subscribe();
    this.trialStimulusComponents.changes.pipe(untilDestroyed(this)).subscribe();
  }

  selected(cue: TrialCueComponentConfig, position: number) {
    this.timerSub?.unsubscribe();
    this.completed.emit({cue, position});
  }

  setTimer() {
    if (this.timerSub) this.timerSub.unsubscribe();
    this.secondsInTrial = 0;
    this.timerSub = interval(1000).pipe(
      takeWhile(() => this.secondsInTrial < this.conditionSvc.trialTimeoutSeconds),
      tap(() => {
        this.secondsInTrial++;
        if (this.secondsInTrial == this.conditionSvc.trialTimeoutSeconds) this.completed.emit();
      }),
      untilDestroyed(this)
    ).subscribe();
  }
}
