import { ApplicationRef, Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { interval } from 'rxjs';

@Injectable()
export class CheckForUpdateService {
  constructor(private appRef: ApplicationRef, private updates: SwUpdate) {}

  start() {
    // Check for updates every 15 seconds
    this.updates.checkForUpdate().then();
    interval(15 * 1000).subscribe(() => this.updates.checkForUpdate());
  }
}
