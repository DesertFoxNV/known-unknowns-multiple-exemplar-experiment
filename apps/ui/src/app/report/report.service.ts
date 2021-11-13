import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { StudyConfig } from '../study-config-form/study-config';
import { STUDY_INSTRUCTIONS } from '../study/study-instructions';
import { ReportEntry } from './report-entry-interface';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  formGroup: FormGroup<ReportEntry>;

  constructor(private fb: FormBuilder) {
    this.formGroup = this.fb.group({
      studyInstructions: ['', Validators.required],
      participantId: ['', Validators.required],
      iCannotKnow: ['', Validators.required],
      contextualControl: ['', Validators.required],
      cueType: ['', [Validators.required]],
      trialTimeoutSeconds: [0, Validators.min(1)],
      balanceEquivalence: [0, Validators.min(1)],
      balanceLessThan: [0, Validators.min(1)],
      balanceGreaterThan: [0, Validators.min(1)],
      balanceICannotKnow: [-1, Validators.min(0)],
      blockId: ['', Validators.required],
      blockAttempts: [-1, Validators.min(0)],
      stimulusCase: ['', Validators.required]
    });
  }

  add<K extends keyof ReportEntry>(key: K, value: ReportEntry[K]) {
    this.formGroup.get(key).setValue(value);
    // console.log('valid', this.formGroup.valid);
    // console.log('value', this.formGroup.value);
  }

  addConfig(config: StudyConfig) {
    this.add('studyInstructions', STUDY_INSTRUCTIONS);
    this.add('participantId', config.participantId);
    this.add('balanceICannotKnow', config.balance.iCannotKnow ?? 0);
    this.add('balanceGreaterThan', config.balance.greaterThan);
    this.add('balanceLessThan', config.balance.lessThan);
    this.add('balanceEquivalence', config.balance.same);
    this.add('contextualControl', config.contextualControl);
    this.add('cueType', config.cueType);
    this.add('iCannotKnow', config.iCannotKnow);
    this.add('trialTimeoutSeconds', config.trialTimeoutSeconds);
    // this.add('stimulusCase', config.stimulusCase);
  }

  reset() {
    this.formGroup.reset();
  }

}
