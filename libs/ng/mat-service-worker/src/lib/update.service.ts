import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Injectable()
export class UpdateService {
  constructor(private updates: SwUpdate) {}

  start() {
    this.updates.available.subscribe(() => document.location.reload());
  }
}
