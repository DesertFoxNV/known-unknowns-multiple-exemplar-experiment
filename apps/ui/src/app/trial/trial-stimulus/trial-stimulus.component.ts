import { Component, Input } from '@angular/core';
import { fadeIn } from '../../animations/fade-in.animation';
import { fadeOut } from '../../animations/fade-out.animation';
import { BUTTON_TEXT_FILE_PATH } from '../../study-conditions/cue';

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
  backgroundImage = `url('${BUTTON_TEXT_FILE_PATH}')`;
  cue = '';

  set(cue: string) {
    this.animate = 'fade-out';

    setTimeout(() => {
      this.cue = cue;
      this.animate = 'fade-in';
    }, 0);
  }
}
