import { APP_INITIALIZER, Provider } from '@angular/core';
import {
  CheckForUpdateService, InstallService, UpdateService
} from '@known-unknowns-multiple-exemplar-experiment/ng-mat-service-worker';
import { INITIALIZER } from './initializer';

export const LISTEN_FOR_INSTALL_EVENT: Provider = {
  provide: APP_INITIALIZER,
  useFactory: INITIALIZER,
  deps: [InstallService, CheckForUpdateService, UpdateService],
  multi: true
};
