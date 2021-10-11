import { AfterViewInit, Component, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { shuffle } from 'lodash-es';
import { interval, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { StudyConditions } from '../study-conditions/study-conditions';
import { TrialCueComponentConfig } from '../study-conditions/trial-cue-component-config';
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
  buttonConfigs: TrialCueComponentConfig[] = [];
  secondsInTrial = 0;
  @Output() selected = new EventEmitter<{ cue: TrialCueComponentConfig, position: number }|undefined>();
  showTrial = true;
  @Input() studyConditions!: StudyConditions;
  @Output() timedOut = new EventEmitter();
  timerSub: Subscription|undefined;
  @ViewChildren(TrialCueComponent) trialButtonComponents!: QueryList<TrialCueComponent>;
  @ViewChildren(TrialStimulusComponent) trialCueComponents!: QueryList<TrialStimulusComponent>;

  next(trial: Trial) {
    const started = new Date();
    const ended = new Date();

    this.buttonConfigs = [...this.studyConditions.cueComponentConfigs];

    if (this.timerSub) this.timerSub.unsubscribe();
    this.secondsInTrial = 0;
    this.timerSub = interval(1000).pipe(tap(() => {
      this.secondsInTrial++;
      if (this.secondsInTrial >= this.studyConditions.config.trialTimeout) {
        this.timedOut.emit();
      }
    })).subscribe();

    setTimeout(() => {
      for (const [i, value] of trial.cues.entries()) this.trialCueComponents.get(i)?.set(value);
      const buttonConfigs = shuffle(this.studyConditions.cueComponentConfigs);
      for (let i = 0; i < this.trialButtonComponents.length; i++) this.trialButtonComponents.get(i)?.set(
        buttonConfigs[i]);
    }, 0);
  };

  ngAfterViewInit(): void {
    this.trialButtonComponents.changes.pipe(untilDestroyed(this)).subscribe();
    this.trialCueComponents.changes.pipe(untilDestroyed(this)).subscribe();
  }
}
