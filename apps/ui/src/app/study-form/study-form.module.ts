import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
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
    ReactiveFormsModule,
    MatCardModule,
    MatDividerModule
  ],
  exports: [
    StudyFormComponent
  ]
})
export class StudyFormModule {}
