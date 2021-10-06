import { Clipboard } from '@angular/cdk/clipboard';
import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { tap } from 'rxjs/operators';
import { BalanceConditions, StudyConditions } from './study-condition.interfaces';

@UntilDestroy()
@Component({
  selector: 'known-unknowns-multiple-exemplar-experiment-study-form',
  templateUrl: './study-form.component.html',
  styleUrls: ['./study-form.component.scss']
})
export class StudyFormComponent implements OnInit {
  form: FormGroup<StudyConditions>;

  constructor(private clipboard: Clipboard, private fb: FormBuilder) {
    const numericValidators1To100 = [Validators.min(1), Validators.max(100)];
    this.form = this.fb.group({
      balance: this.fb.group<BalanceConditions>({
        lessThan: [1, numericValidators1To100],
        equalTo: [1, numericValidators1To100],
        greaterThan: [1, numericValidators1To100],
        idk: [{ value: 1, disabled: true }, numericValidators1To100]
      }),
      contextualControl: [false, Validators.required],
      idk: [false, Validators.required],
      participantId: ['', [Validators.required, Validators.minLength(3)]],
      trialTimeout: [1, [Validators.min(1), Validators.max(1000)]]
    });
  }

  ngOnInit(): void {
    this.form.get('idk').valueChanges.pipe(
      tap((idk) => {
        if (idk)
          this.form.get('balance.idk').enable();
        else
          this.form.get('balance.idk').disable();
      }),
      untilDestroyed(this)
    ).subscribe();
  }

  showJson() {
    alert(JSON.stringify(this.form.value))
  }

}
