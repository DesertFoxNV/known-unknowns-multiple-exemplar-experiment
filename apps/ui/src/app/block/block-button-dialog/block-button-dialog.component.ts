import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fadeOut } from '../../animations/fade-out.animation';
import { FADE_OUT_DURATION } from '../../trial/fade-out-duration';
import { delay } from '../../trial/delay';

@Component({
  selector: 'block-start-dialog',
  templateUrl: './block-button-dialog.component.html',
  styleUrls: ['./block-button-dialog.component.css'],
  animations: [
    fadeOut({ duration: FADE_OUT_DURATION })
  ]
})
export class BlockButtonDialogComponent {
  animated = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: string,
    readonly ref: MatDialogRef<BlockButtonDialogComponent>
  ) { }

  async close() {
    this.animated = true;
    await delay(FADE_OUT_DURATION);
    this.ref.close();
  }

}
