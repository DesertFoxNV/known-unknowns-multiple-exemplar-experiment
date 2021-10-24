import {Component, EventEmitter, Input, Output} from '@angular/core';
import {fadeIn} from '../../animations/fade-in.animation';
import {fadeOut} from '../../animations/fade-out.animation';
import {TrialCueComponentConfig} from '../../study-conditions/trial-cue-component-config';
import {FADE_OUT_DURATION_MS} from '../fade-out-duration';
import {delay} from "../delay";

@Component({
  selector: 'trial-cue',
  templateUrl: './trial-cue.component.html',
  styleUrls: ['../trial.component.scss', './trial-cue.component.scss'],
  animations: [
    fadeIn(),
    fadeOut({duration: FADE_OUT_DURATION_MS})
  ]
})
export class TrialCueComponent {
  animate?: 'fade-in' | 'fade-out';
  @Input() animationDelay = 0;
  config?: TrialCueComponentConfig;
  @Output() selected = new EventEmitter<TrialCueComponentConfig>();

  async set(config: TrialCueComponentConfig) {
    this.animate = 'fade-out';
    // This delay prevents the cues from changing mid animation.
    await delay(FADE_OUT_DURATION_MS);
    this.config = config;
    this.animate = 'fade-in';
  }
}
