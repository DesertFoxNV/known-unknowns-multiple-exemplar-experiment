import { APP_INITIALIZER, NgModule, Provider } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import {
  InstallService, MatServiceWorkerModule
} from '@known-unknowns-multiple-exemplar-experiment/ng-mat-service-worker';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { GraphModule } from './graph/graph.module';

const initializer = (installService: InstallService) => () =>
  installService.listen();
const listenForInstallEvent: Provider = {
  provide: APP_INITIALIZER,
  useFactory: initializer,
  deps: [InstallService],
  multi: true
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    GraphModule,
    HammerModule,
    MatSnackBarModule,
    MatRippleModule,
    MatServiceWorkerModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      registrationStrategy: 'registerImmediately'
    })
  ],
  providers: [
    listenForInstallEvent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
