import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fadeOut } from '../../animations/fade-out.animation';
import { FeedBackDialogData } from './feed-back-dialog.data';

@Component({
  selector: 'trial-correct-dialog',
  templateUrl: './trial-feedback-dialog.component.html',
  styleUrls: ['./trial-feedback-dialog.component.css'],
  animations: [
    fadeOut()
  ]
})
export class TrialFeedbackDialogComponent {
  animated = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: FeedBackDialogData,
    readonly ref: MatDialogRef<TrialFeedbackDialogComponent>
  ) {
    setTimeout(() => this.animated = true, 0); // This delay prevents a change detection error
    setTimeout(() => this.ref.close(), this.data.durationMs);
    if (data.feedback === 'CORRECT' || data.feedback === 'WRONG') {
      const audio = new Audio();
      audio.src = data.feedback === 'CORRECT' ? './assets/correct.mp3' : './assets/wrong.mp3';
      audio.load();
      audio.play().then(() => audio.remove());
    }
  }
}
