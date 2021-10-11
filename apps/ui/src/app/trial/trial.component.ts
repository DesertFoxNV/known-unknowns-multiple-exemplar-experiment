import { AfterViewInit, Component, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { shuffle } from 'lodash-es';
import { interval, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TrialButtonConfig } from '../study-conditions/cue-case';
import { StudyConditions } from '../study-conditions/study-conditions';
import { Trial } from './trial';
import { TrialButtonComponent } from './trial-button/trial-button.component';
import { TrialCueComponent } from './trial-cue/trial-cue.component';

@UntilDestroy()
@Component({
  selector: 'kumee-trial',
  templateUrl: './trial.component.html',
  styleUrls: ['./trial.component.scss'],
  animations: [
    fadeInOnEnterAnimation({ anchor: 'enter' })
  ]
})
export class TrialComponent implements AfterViewInit {
  buttonConfigs: TrialButtonConfig[] = [];
  @Output() selected = new EventEmitter<{ cue: TrialButtonConfig|undefined, position: number }|undefined>();
  secondsInTrial = 0;
  showTrial = true;
  @Input() studyConditions!: StudyConditions;
  @Output() timedOut = new EventEmitter();
  timerSub: Subscription|undefined;
  @ViewChildren(TrialButtonComponent) trialButtonComponents!: QueryList<TrialButtonComponent>;
  @ViewChildren(TrialCueComponent) trialCueComponents!: QueryList<TrialCueComponent>;

  next(trial: Trial) {
    const started = new Date();
    const ended = new Date();

    this.buttonConfigs = [...this.studyConditions.cues.buttons];

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
      const buttonConfigs = shuffle(this.studyConditions.cues.buttons);
      for (let i = 0; i < this.trialButtonComponents.length; i++) this.trialButtonComponents.get(i)?.set(
        buttonConfigs[i]);
    }, 0);
  };

  ngAfterViewInit(): void {
    this.trialButtonComponents.changes.pipe(untilDestroyed(this)).subscribe();
    this.trialCueComponents.changes.pipe(untilDestroyed(this)).subscribe();
  }
}
