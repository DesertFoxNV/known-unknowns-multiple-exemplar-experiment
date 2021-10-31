import { NgModule } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    HammerModule,
    MatSnackBarModule,
    MatRippleModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
