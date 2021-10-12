import { Component, EventEmitter, Input, Output } from '@angular/core';
import { fadeIn } from '../../animations/fade-in.animation';
import { fadeOut } from '../../animations/fade-out.animation';
import { BUTTON_TEXT_FILE_PATH } from '../../study-conditions/cue.constants';
import { TrialCueComponentConfig } from '../../study-conditions/trial-cue-component-config';

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
  backgroundImage = '';
  config: TrialCueComponentConfig|undefined;
  @Output() selected = new EventEmitter<TrialCueComponentConfig>();

  constructor() {
    this.bgImage = BUTTON_TEXT_FILE_PATH;
  }

  set bgImage(fileName: string) {
    this.backgroundImage = 'url(' + fileName + ')';
  }

  set(config: TrialCueComponentConfig) {
    this.animate = 'fade-out';

    setTimeout(() => {
      this.config = config;
      this.bgImage = config.fileName;
      this.animate = 'fade-in';
    }, 0);
  }
}
