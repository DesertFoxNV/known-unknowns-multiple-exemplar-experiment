import { Component, EventEmitter, Input, Output } from '@angular/core';
import { fadeIn } from '../../animations/fade-in.animation';
import { fadeOut } from '../../animations/fade-out.animation';
import { TrialCueComponentConfig } from '../../study-conditions/trial-cue-component-config';
import { FADE_OUT_DURATION } from '../fade-out-duration';
import { delay } from '../delay';

@Component({
  selector: 'trial-cue',
  templateUrl: './trial-cue.component.html',
  styleUrls: ['../trial.component.scss', './trial-cue.component.scss'],
  animations: [
    fadeIn(),
    fadeOut({ duration: FADE_OUT_DURATION })
  ]
})
export class TrialCueComponent {
  animate?: 'fade-in'|'fade-out';
  @Input() animationDelay = 0;
  backgroundImage?: string;
  config?: TrialCueComponentConfig;
  @Output() selected = new EventEmitter<TrialCueComponentConfig>();

  async set(config: TrialCueComponentConfig) {
    this.animate = 'fade-out';
    await delay(FADE_OUT_DURATION);
    this.config = config;
    this.backgroundImage = config.fileName;
    this.animate = 'fade-in';
  }
}
