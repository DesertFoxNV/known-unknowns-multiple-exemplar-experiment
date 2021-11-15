import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDialogModule } from '@angular/material/dialog';
import { TrialModule } from '../../trial/trial.module';
import { BlockButtonDialogModule } from '../block-button-dialog/block-button-dialog.module';
import { TrainingNetworksBlockComponent } from './training-networks-block.component';

@NgModule({
  declarations: [
    TrainingNetworksBlockComponent
  ],
  exports: [
    TrainingNetworksBlockComponent
  ],
  imports: [
    BlockButtonDialogModule,
    CommonModule,
    FlexLayoutModule,
    MatDialogModule,
    TrialModule
  ]
})
export class TrainingNetworksBlockModule {}
