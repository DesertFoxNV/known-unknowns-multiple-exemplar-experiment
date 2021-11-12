import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { BlockModule } from '../block/block.module';

import { StudyRoutingModule } from './study-routing.module';
import { StudyComponent } from './study.component';

@NgModule({
  declarations: [
    StudyComponent
  ],
  exports: [
    StudyComponent
  ],
  imports: [
    CommonModule,
    StudyRoutingModule,
    BlockModule,
    MatCardModule,
    MatButtonModule
  ]
})
export class StudyModule {}
