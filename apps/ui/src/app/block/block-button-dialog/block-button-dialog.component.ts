import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fadeOut } from '../../animations/fade-out.animation';
import { delay } from '../../trial/delay';
import { FADE_OUT_DURATION_MS } from '../../trial/fade-out-duration';

export interface BlockButtonDialogData {
  disabled?: boolean;
  text: string;
}

@Component({
  selector: 'block-start-dialog',
  templateUrl: './block-button-dialog.component.html',
  styleUrls: ['./block-button-dialog.component.css'],
  animations: [
    fadeOut({ duration: FADE_OUT_DURATION_MS })
  ]
})
export class BlockButtonDialogComponent {
  animated = false;
  disabled = Boolean(this.data.disabled);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: BlockButtonDialogData,
    readonly ref: MatDialogRef<BlockButtonDialogComponent>
  ) { }

  async close() {
    if (!this.data.disabled) {
      this.animated = true;
      await delay(FADE_OUT_DURATION_MS);
      this.ref.close();
    }
  }

}
