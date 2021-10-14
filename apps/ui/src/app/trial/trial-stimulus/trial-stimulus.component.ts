import { Component, Input } from '@angular/core';
import { fadeIn } from '../../animations/fade-in.animation';
import { fadeOut } from '../../animations/fade-out.animation';
import { BUTTON_TEXT_FILE_PATH } from '../../study-conditions/cue.constants';
import { FADE_OUT_DURATION } from '../cue-and-stimulus-fade-out-duration';
import { delay } from '../delay';

@Component({
  selector: 'trial-stimulus',
  templateUrl: './trial-stimulus.component.html',
  styleUrls: ['../trial.component.scss', './trial-stimulus.component.scss'],
  animations: [
    fadeIn(),
    fadeOut({ duration: FADE_OUT_DURATION })
  ]
})
export class TrialStimulusComponent {
  animate?: 'fade-in'|'fade-out';
  @Input() animationDelay = 0;
  backgroundImage?: string;
  cue?: string;

  async set(cue: string) {
    this.animate = 'fade-out';

    await delay(FADE_OUT_DURATION);

    this.backgroundImage = BUTTON_TEXT_FILE_PATH;
    this.cue = cue;
    this.animate = 'fade-in';
  }
}
