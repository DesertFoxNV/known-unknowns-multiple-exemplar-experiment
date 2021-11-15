import { Component, Inject } from '@angular/core';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';

@Component({
  selector: 'mat-service-worker-install-prompt',
  templateUrl: './install-prompt.component.html',
  styleUrls: ['./install-prompt.component.scss'],
})
export class InstallPromptComponent {
  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: { promptEvent?: any },
    private bottomSheetRef: MatBottomSheetRef<InstallPromptComponent>
  ) {}

  public installPwa(): void {
    this.data.promptEvent.prompt();
    this.close();
  }

  public close() {
    this.bottomSheetRef.dismiss();
  }
}
