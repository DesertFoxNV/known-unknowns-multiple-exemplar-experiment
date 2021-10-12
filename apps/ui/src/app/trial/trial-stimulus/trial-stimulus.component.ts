import { Component, Input } from '@angular/core';
import { fadeIn } from '../../animations/fade-in.animation';
import { fadeOut } from '../../animations/fade-out.animation';
import { BUTTON_TEXT_FILE_PATH } from '../../study-conditions/cue.constants';
import { nextTick } from '../next-tick';

@Component({
  selector: 'trial-stimulus',
  templateUrl: './trial-stimulus.component.html',
  styleUrls: ['../trial.component.scss', './trial-stimulus.component.scss'],
  animations: [
    fadeIn(),
    fadeOut({ duration: 250 })
  ]
})
export class TrialStimulusComponent {
  animate: 'fade-in'|'fade-out' = 'fade-out';
  @Input() animationDelay = 0;
  backgroundImage = BUTTON_TEXT_FILE_PATH;
  cue = '';

  async set(cue: string) {
    this.animate = 'fade-out';

    await nextTick();

    this.cue = cue;
    this.animate = 'fade-in';
  }
}
