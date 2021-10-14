import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { TrialModule } from '../trial/trial.module';
import { BlockComponent } from './block.component';

@NgModule({
  declarations: [
    BlockComponent
  ],
  exports: [
    BlockComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    TrialModule,
    FlexLayoutModule,
    MatButtonModule,
    MatRippleModule
  ]
})
export class BlockModule {}
