import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatRippleModule } from '@angular/material/core';
import { OverlayComponent } from './overlay.component';



@NgModule({
  declarations: [
    OverlayComponent
  ],
  exports: [
    OverlayComponent
  ],
  imports: [
    CommonModule,
    MatRippleModule
  ]
})
export class OverlayModule { }
