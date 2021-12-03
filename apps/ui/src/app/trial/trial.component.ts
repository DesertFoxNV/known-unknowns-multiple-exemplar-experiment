import { AfterViewInit, Component, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Subscription, timer } from 'rxjs';
import { takeWhile, tap } from 'rxjs/operators';
import { TRIAL_ANIMATION_DELAY_MS, TRIAL_ANIMATION_DURATION_MS } from '../block/trial-animation-delay';
import { TrialCueComponentConfig } from '../study-conditions/trial-cue-component-config';
import { StudyConfig } from '../study-config-form/study-config';
import { Trial } from './trial';
import { TrialCueComponent } from './trial-cue/trial-cue.component';
import { TrialStimulusComponent } from './trial-stimulus/trial-stimulus.component';

export interface TrialCompleted {
  completedAt: Date;
  cue?: TrialCueComponentConfig,
  position?: number
  startedAt: Date;
}

@UntilDestroy()
@Component({
  selector: 'trial',
  templateUrl: './trial.component.html',
  styleUrls: ['./trial.component.scss']
})
export class TrialComponent implements AfterViewInit {
  animationDelayMs = TRIAL_ANIMATION_DELAY_MS;
  complete = false;
  @Output() completed = new EventEmitter<TrialCompleted>();
  secondsInTrial = 0;
  startedAt: Date|undefined;
  @Input() studyConfig?: StudyConfig;
  timerSub: Subscription|undefined;
  @ViewChildren(TrialCueComponent) trialCueComponents?: QueryList<TrialCueComponent>;
  @ViewChildren(TrialStimulusComponent) trialStimulusComponents?: QueryList<TrialStimulusComponent>;

  clearTimer() {
    if (this.timerSub) this.timerSub.unsubscribe();
  }

  ngAfterViewInit(): void {
    if (!this.trialCueComponents) throw Error('Trial cue components are undefined');
    if (!this.trialStimulusComponents) throw Error('Trial stimulus components are undefined');
    this.trialCueComponents.changes.pipe(untilDestroyed(this)).subscribe();
    this.trialStimulusComponents.changes.pipe(untilDestroyed(this)).subscribe();
  }

  selected(cue?: TrialCueComponentConfig, position?: number): void {
    if (!this.startedAt) throw Error('Started at date is undefined');
    this.clearTimer();
    this.complete = true;
    this.completed.emit({ cue, position, startedAt: this.startedAt, completedAt: new Date() });
  }

  setTimer() {
    const { studyConfig } = this; // defined locally so that typescript can properly infer types
    if (!studyConfig) throw Error('Study configuration is undefined');

    this.clearTimer();
    this.secondsInTrial = 0;

    this.timerSub = timer(TRIAL_ANIMATION_DURATION_MS, 1000).pipe(
      takeWhile(() => this.secondsInTrial < studyConfig.trialTimeoutSeconds && !this.complete),
      tap(() => {
        this.secondsInTrial++;
        if (this.secondsInTrial === studyConfig.trialTimeoutSeconds && !this.complete) this.selected();
      }),
      untilDestroyed(this)
    ).subscribe();
  }

  show(trial: Trial) {
    if (!this.trialCueComponents) throw Error('Trial cue components are undefined');
    if (!this.trialStimulusComponents) throw Error('Trial stimulus components are undefined');
    setTimeout(() => this.startedAt = new Date(), TRIAL_ANIMATION_DELAY_MS.cues[0]);
    this.complete = false;
    this.setTimer();
    for (const [i, node] of trial.stimuli.entries()) this.trialStimulusComponents.get(i)?.set(node.value);
    for (let i = 0; i < this.trialCueComponents.length; i++) this.trialCueComponents.get(i)?.set(
      trial.cueComponentConfigs[i]);
  };
}
