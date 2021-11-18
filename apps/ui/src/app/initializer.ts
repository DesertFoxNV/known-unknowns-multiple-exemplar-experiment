import {
  CheckForUpdateService, InstallService, UpdateService
} from '@known-unknowns-multiple-exemplar-experiment/ng-mat-service-worker';
import { environment } from '../environments/environment';

export const INITIALIZER = (
  installSvc: InstallService,
  checkForUpdateSvc: CheckForUpdateService,
  updateSvc: UpdateService
) => () => {
  installSvc.listen();
  if (environment.production) {
    checkForUpdateSvc.start();
    updateSvc.start();
  }
};
