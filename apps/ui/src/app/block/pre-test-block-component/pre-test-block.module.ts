import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDialogModule } from '@angular/material/dialog';
import { TrialModule } from '../../trial/trial.module';
import { BlockButtonDialogModule } from '../block-button-dialog/block-button-dialog.module';
import { PreTestBlockComponent } from './pre-test-block.component';

@NgModule({
  declarations: [
    PreTestBlockComponent
  ],
  exports: [
    PreTestBlockComponent
  ],
  imports: [
    BlockButtonDialogModule,
    CommonModule,
    FlexLayoutModule,
    MatDialogModule,
    TrialModule
  ]
})
export class PreTestBlockModule {}
