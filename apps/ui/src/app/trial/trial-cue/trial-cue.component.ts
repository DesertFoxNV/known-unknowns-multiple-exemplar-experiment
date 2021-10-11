import { Component, EventEmitter, Input, Output } from '@angular/core';
import { fadeIn } from '../../animations/fade-in.animation';
import { fadeOut } from '../../animations/fade-out.animation';
import { BUTTON_TEXT_FILE_PATH } from '../../study-conditions/cue';
import { TrialButtonConfig } from '../../study-conditions/cue-case';

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
  config: TrialButtonConfig|undefined;
  @Output() selected = new EventEmitter<TrialButtonConfig>();

  constructor() {
    this.bgImage = BUTTON_TEXT_FILE_PATH;
  }

  set bgImage(fileName: string) {
    this.backgroundImage = 'url(' + fileName + ')';
  }

  set(config: TrialButtonConfig) {
    this.animate = 'fade-out';

    setTimeout(() => {
      this.config = config;
      this.bgImage = config.fileName;
      this.animate = 'fade-in';
    }, 0);
  }
}
