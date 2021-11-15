import { Component, Input } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { timer } from 'rxjs';
import { fadeIn } from '../../animations/fade-in.animation';
import { fadeOut } from '../../animations/fade-out.animation';
import { BUTTON_TEXT_FILE_PATH } from '../../study-conditions/cue.constants';
import { FADE_OUT_DURATION_MS } from '../fade-out-duration';

@Component({
  selector: 'trial-stimulus',
  templateUrl: './trial-stimulus.component.html',
  styleUrls: ['../trial.component.scss', './trial-stimulus.component.scss'],
  animations: [
    fadeIn(),
    fadeOut({ duration: FADE_OUT_DURATION_MS })
  ]
})
export class TrialStimulusComponent {
  animate?: 'fade-in'|'fade-out';
  @Input() animationDelay = 0;
  backgroundImage?: string;
  cue?: string;
  isDesktop = this.deviceDetectorSvc.isDesktop();

  constructor(private deviceDetectorSvc: DeviceDetectorService) {}

  async set(cue: string) {
    this.animate = 'fade-out';
    // This delay prevents the cues from changing mid animation.
    await timer(FADE_OUT_DURATION_MS).toPromise();
    this.backgroundImage = BUTTON_TEXT_FILE_PATH;
    this.cue = cue;
    this.animate = 'fade-in';
  }
}
