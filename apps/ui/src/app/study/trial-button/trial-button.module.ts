import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatRippleModule } from '@angular/material/core';
import { TrialButtonComponent } from './trial-button.component';



@NgModule({
  declarations: [
    TrialButtonComponent
  ],
  exports: [
    TrialButtonComponent
  ],
  imports: [
    CommonModule,
    MatRippleModule
  ]
})
export class TrialButtonModule { }
