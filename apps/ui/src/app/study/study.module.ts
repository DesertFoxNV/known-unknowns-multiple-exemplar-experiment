import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatRippleModule } from '@angular/material/core';

import { StudyRoutingModule } from './study-routing.module';
import { StudyComponent } from './study.component';


@NgModule({
  declarations: [
    StudyComponent
  ],
  imports: [
    CommonModule,
    StudyRoutingModule,
    MatRippleModule
  ]
})
export class StudyModule { }
