import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
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
    MatButtonModule
  ]
})
export class BlockModule {}
