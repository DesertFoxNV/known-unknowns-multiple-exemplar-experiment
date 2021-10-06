import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudyFormComponent } from './study-form.component';

const routes: Routes = [
  {
    path: '',
    component: StudyFormComponent
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudyFormRoutingModule {}
