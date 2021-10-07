import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudyConfigFormComponent } from './study-config-form.component';

const routes: Routes = [
  {
    path: '',
    component: StudyConfigFormComponent
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudyConfigFormRoutingModule {}
