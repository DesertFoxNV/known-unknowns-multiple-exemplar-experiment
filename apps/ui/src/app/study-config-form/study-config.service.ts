import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SnackBarService } from '@known-unknowns-multiple-exemplar-experiment/ng/mat-snack-bar';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { Observable } from 'rxjs';
import { catchError, first, map, tap } from 'rxjs/operators';
import { CueType } from '../study-conditions/cue';
import { studyConfigFromParams } from '../study/study-config-from-params';
import { BalanceConfig, StudyConfig } from './study-config.interfaces';

@Injectable({
  providedIn: 'root'
})
export class StudyConfigService {

  constructor(
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private snackBarSvc: SnackBarService
  ) { }

  config$(): Observable<StudyConfig> {
    return this.activatedRoute.queryParams.pipe(
      first(),
      map(studyConfigFromParams),
      tap((config) => this.isConfigValid(config)),
      catchError((err) => {
        this.snackBarSvc.error(err.message);
        return [err];
      }));
  }

  createForm(iCannotKnowBalanceDisabled = true): FormGroup<StudyConfig> {
    const numericValidators1To100 = [Validators.required, Validators.min(1), Validators.max(100)];
    return this.fb.group({
      balance: this.fb.group<BalanceConfig>({
        lessThan: [1, numericValidators1To100],
        equalTo: [1, numericValidators1To100],
        greaterThan: [1, numericValidators1To100],
        iCannotKnow: [{ value: 1, disabled: iCannotKnowBalanceDisabled }, numericValidators1To100]
      }),
      contextualControl: [false, Validators.required],
      cueType: [CueType.nonArbitrary, Validators.required],
      iCannotKnow: [false, Validators.required],
      participantId: ['', [Validators.required, Validators.minLength(3)]],
      trialTimeout: [1, [Validators.required, Validators.min(1), Validators.max(1000)]]
    });
  }

  isConfigValid(config: StudyConfig): void {
    const form = this.createForm(config?.iCannotKnow === false);
    form.patchValue(config);
    if (form.invalid) throw Error('Study configuration params are invalid.');
  }
}
