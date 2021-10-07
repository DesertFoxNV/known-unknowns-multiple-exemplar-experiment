import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
    pathMatch: 'full'
  },
  {
    path: 'study-form',
    loadChildren: () => import('./study-config-form/study-config-form.module').then((m) => m.StudyConfigFormModule)
  },
  {
    path: 'study',
    loadChildren: () => import('./study/study.module').then((m) => m.StudyModule)
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
