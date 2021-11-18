import { Component, OnInit } from '@angular/core';
import {
  CheckForUpdateService, UpdateService
} from '@known-unknowns-multiple-exemplar-experiment/ng-mat-service-worker';
import { environment } from '../environments/environment';

@Component({
  selector: 'root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private checkForUpdatesSvc: CheckForUpdateService, private updateSvc: UpdateService ) {}

  ngOnInit() {
    if (environment.production) {
      this.checkForUpdatesSvc.start();
      this.updateSvc.start();
    }
  }
}
