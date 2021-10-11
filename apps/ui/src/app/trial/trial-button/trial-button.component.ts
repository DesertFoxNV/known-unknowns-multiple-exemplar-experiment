import { Component, EventEmitter, Input, Output } from '@angular/core';
import { fadeInOnEnterAnimation, fadeOutOnLeaveAnimation } from 'angular-animations';
import { CueType } from '../../study-conditions/cue';
import { TrialButtonConfig } from '../../study-conditions/cue-case';

@Component({
  selector: 'kumee-trial-button',
  templateUrl: './trial-button.component.html',
  styleUrls: ['./trial-button.component.scss'],
  animations: [
    fadeInOnEnterAnimation({ anchor: 'enter' }),
    fadeOutOnLeaveAnimation({ anchor: 'leave' })
  ]
})
export class TrialButtonComponent {
  backgroundImage = '';
  config: TrialButtonConfig|undefined;
  cue = '';
  @Output() cueClicked = new EventEmitter<TrialButtonConfig>();
  cueType = CueType;
  @Input() delay = 0;
  show = false;
  @Input() type: CueType|undefined = CueType.arbitrary;

  set(config: TrialButtonConfig) {
    this.config = config;
    this.show = false;
    setTimeout(() => {
      this.cue = config.cue;
      this.setBackgroundImage(config.fileName);
      this.show = true;
    }, 0);
  }

  setBackgroundImage(fileName: string) {
    this.backgroundImage = 'url(' + fileName + ')';
  }
}
