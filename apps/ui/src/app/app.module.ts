import { NgModule } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { MatServiceWorkerModule } from '@known-unknowns-multiple-exemplar-experiment/ng-mat-service-worker';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { GraphModule } from './graph/graph.module';
import { LISTEN_FOR_INSTALL_EVENT } from './listen-for-install-event';
import { OverlayModule } from './overlay/overlay.module';

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
    OverlayModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: true,
      registrationStrategy: 'registerImmediately'
    })
  ],
  providers: [
    LISTEN_FOR_INSTALL_EVENT
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
