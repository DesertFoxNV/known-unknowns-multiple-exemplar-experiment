import { Injectable } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { DeviceDetectorService } from 'ngx-device-detector';
import { fromEvent } from 'rxjs';
import { first } from 'rxjs/operators';
import { InstallPromptComponent } from './install-prompt/install-prompt.component';

@Injectable({
  providedIn: 'root',
})
export class InstallService {
  isMobileOrTablet = !this.deviceDetectorSvc.isDesktop();
  private promptEvent?: Event;

  constructor(
    private bottomSheet: MatBottomSheet,
    private deviceDetectorSvc: DeviceDetectorService
  ) {}

  listen() {
    if (!this.isMobileOrTablet) return;

    fromEvent(window, 'beforeinstallprompt')
      .pipe(first())
      .subscribe((e) => {
        e.preventDefault();
        this.promptEvent = e;
        this.bottomSheet.open(InstallPromptComponent, {
          data: { promptEvent: this.promptEvent },
        });
      });
  }
}
