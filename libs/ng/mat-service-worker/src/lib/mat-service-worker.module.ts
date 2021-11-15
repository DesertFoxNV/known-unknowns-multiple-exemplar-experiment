import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CheckForUpdateService } from './check-for-update.service';
import { InstallPromptComponent } from './install-prompt/install-prompt.component';
import { UpdateService } from './update.service';

@NgModule({
  declarations: [InstallPromptComponent],
  imports: [
    CommonModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
  ],
})
export class MatServiceWorkerModule {
  static forRoot(): ModuleWithProviders<MatServiceWorkerModule> {
    return {
      ngModule: MatServiceWorkerModule,
      providers: [CheckForUpdateService, UpdateService],
    };
  }
}
