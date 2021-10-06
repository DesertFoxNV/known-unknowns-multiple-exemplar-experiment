import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';

import { StudyFormRoutingModule } from './study-form-routing.module';
import { StudyFormComponent } from './study-form.component';

@NgModule({
  declarations: [
    StudyFormComponent
  ],
  imports: [
    CommonModule,
    StudyFormRoutingModule,
    MatToolbarModule,
    MatCheckboxModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  exports: [
    StudyFormComponent
  ]
})
export class StudyFormModule {}
