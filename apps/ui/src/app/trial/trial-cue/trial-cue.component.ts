import { Component, EventEmitter, Input, Output } from '@angular/core';
import { fadeIn } from '../../animations/fade-in.animation';
import { fadeOut } from '../../animations/fade-out.animation';
import { BUTTON_TEXT_FILE_PATH } from '../../study-conditions/cue.constants';
import { TrialCueComponentConfig } from '../../study-conditions/trial-cue-component-config';
import { nextTick } from '../next-tick';

@Component({
  selector: 'trial-cue',
  templateUrl: './trial-cue.component.html',
  styleUrls: ['../trial.component.scss', './trial-cue.component.scss'],
  animations: [
    fadeIn(),
    fadeOut({ duration: 250 })
  ]
})
export class TrialCueComponent {
  animate: 'fade-in'|'fade-out' = 'fade-out';
  @Input() animationDelay = 0;
  backgroundImage = BUTTON_TEXT_FILE_PATH;
  config?: TrialCueComponentConfig;
  @Output() selected = new EventEmitter<TrialCueComponentConfig>();

  async set(config: TrialCueComponentConfig) {
    this.animate = 'fade-out';

    await nextTick();

    this.config = config;
    this.backgroundImage = config.fileName;
    this.animate = 'fade-in';
  }
}
