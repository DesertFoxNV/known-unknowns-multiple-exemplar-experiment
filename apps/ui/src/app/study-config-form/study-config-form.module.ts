import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AutoFocusModule } from '@known-unknowns-multiple-exemplar-experiment/ng/ui-auto-focus-directive';

import { StudyConfigFormRoutingModule } from './study-config-form-routing.module';
import { StudyConfigFormComponent } from './study-config-form.component';

@NgModule({
  declarations: [
    StudyConfigFormComponent
  ],
  imports: [
    AutoFocusModule,
    CommonModule,
    StudyConfigFormRoutingModule,
    MatToolbarModule,
    MatCheckboxModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatDividerModule,
    MatSelectModule
  ],
  exports: [
    StudyConfigFormComponent
  ]
})
export class StudyConfigFormModule {}
