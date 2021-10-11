import { Component, Input } from '@angular/core';
import { fadeInOnEnterAnimation, fadeOutOnLeaveAnimation } from 'angular-animations';
import { BUTTON_TEXT_FILE_PATH } from '../../study-conditions/cue';

@Component({
  selector: 'kumee-trial-cue',
  templateUrl: './trial-cue.component.html',
  styleUrls: ['./trial-cue.component.scss'],
  animations: [
    fadeInOnEnterAnimation({ anchor: 'enter' }),
    fadeOutOnLeaveAnimation({ anchor: 'leave' })
  ]
})
export class TrialCueComponent {
  backgroundImage = `url('${BUTTON_TEXT_FILE_PATH}')`;
  cue = '';
  @Input() delay = 0;
  show = false;

  set(cue: string) {
    this.show = false;
    setTimeout(() => {
      this.cue = cue;
      this.show = true;
    }, 0);
  }
}
