import { NgModule } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { OverlayModule } from './overlay/overlay.module';

@NgModule({
  declarations: [AppComponent],
  imports: [AppRoutingModule, BrowserModule, BrowserAnimationsModule, MatSnackBarModule, MatRippleModule, OverlayModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
