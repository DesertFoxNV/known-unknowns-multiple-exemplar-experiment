import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackBarService } from '@known-unknowns-multiple-exemplar-experiment/ng/mat-snack-bar';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { catchError, first, map, tap } from 'rxjs/operators';
import { studyConfigFromParams } from '../param-conversions/study-config-from-params';
import { CUE_TYPE } from '../study-conditions/cue.constants';
import { StudyConfig } from './study-config';

@Injectable({
  providedIn: 'root'
})
export class StudyConfigService {
  constructor(
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private snackBarSvc: SnackBarService
  ) {
  }

  private _config?: StudyConfig;

  get config(): StudyConfig {
    if (!this._config) throw Error('Config is not defined');
    return this._config;
  }

  get participantId(): string {
    return this.config.participantId;
  }

  createForm(iCannotKnowBalanceDisabled = true): FormGroup<StudyConfig> {
    const numericValidators1To100 = [Validators.required, Validators.min(1), Validators.max(100)];
    return this.fb.group({
      balance: this.fb.group<StudyConfig['balance']>({
        lessThan: [1, numericValidators1To100],
        same: [1, numericValidators1To100],
        greaterThan: [1, numericValidators1To100],
        iCannotKnow: [{ value: 1, disabled: iCannotKnowBalanceDisabled }, numericValidators1To100]
      }),
      contextualControl: [false, Validators.required],
      cueType: [CUE_TYPE.nonArbitrary, Validators.required],
      iCannotKnow: [false, Validators.required],
      participantId: ['', [Validators.required, Validators.minLength(3)]],
      trialTimeoutSeconds: [10, [Validators.required, Validators.min(1), Validators.max(1000)]]
    });
  }

  isConfigValid(config: StudyConfig): void {
    const form = this.createForm(config?.iCannotKnow === false);
    form.patchValue(config);
    if (form.invalid) throw Error('Study configuration params are invalid.');
  }

  async loadStudyConfigFromParams(): Promise<void> {
    this._config = await this.activatedRoute.queryParams.pipe(
      first(),
      map(studyConfigFromParams),
      tap((config) => this.isConfigValid(config)),
      catchError((err) => {
        this.snackBarSvc.error(err.message);
        this.router.navigate([`../`]).then();
        return [err];
      })).toPromise();
  }
}
