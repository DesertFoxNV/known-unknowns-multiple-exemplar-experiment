import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
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
    BlockModule
  ]
})
export class StudyModule {}
