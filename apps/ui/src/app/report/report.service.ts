import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { init, send } from 'emailjs-com';
import { BlockComponent } from '../block/block.component';
import { StudyConfig } from '../study-config-form/study-config';
import { StudyConfigService } from '../study-config-form/study-config.service';
import { STUDY_INSTRUCTIONS } from '../study/study-instructions';
import { TrialCompleted } from '../trial/trial.component';
import { ReportEntry } from './report-entry-interface';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  formGroup: FormGroup<ReportEntry>;
  reportEntries: ReportEntry[] = [];
  studyConfig?: StudyConfig;

  constructor(private fb: FormBuilder, private studyConfigService: StudyConfigService) {
    this.formGroup = this.fb.group({
      studyInstructions: [''],
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
      stimulusCase: ['', Validators.required],
      trainingAttempts: [-1, Validators.min(0)],
      probeAttempts: [-1, Validators.min(0)],
      trialNumber: [-1, Validators.min(0)],
      totalTrials: [-1, Validators.min(0)],
      sampleNode: ['', Validators.required],
      sample: ['', Validators.required],
      comparisonNode: ['', Validators.required],
      comparison: ['', Validators.required],
      correctResponse: ['', Validators.required],
      button1Image: ['', Validators.required],
      button1Relation: ['', Validators.required],
      button2Image: ['', Validators.required],
      button2Relation: ['', Validators.required],
      button3Image: ['', Validators.required],
      button3Relation: ['', Validators.required],
      button4Image: ['', Validators.required],
      button4Relation: ['', Validators.required],
      buttonPosition: [-2, Validators.min(-1)],
      selectedResponse: [''],
      consequence: [''],
      trialStarted: ['', Validators.required],
      trialCompleted: ['', Validators.required],
      trialDurationInSeconds: [-1, Validators.min(0)],
      trialOutcome: ['', Validators.required],
      containsSequentialTriplicates: ['', Validators.required],
      failSafeDuration: ['', Validators.required],
      startInstructions: ['', Validators.required],
      retryInstructions: ['', Validators.required],
      studyFailed: ['FALSE'],
      sequentialCorrect: [-1, Validators.min(0)]
    });
  }

  add<K extends keyof ReportEntry>(key: K, value: ReportEntry[K]) {
    this.formGroup.get(key).setValue(value);
  }

  addTrial(block: BlockComponent, selected: TrialCompleted) {
    if (!block.studyConfig) throw Error('Study configuration is undefined');
    this.studyConfig = block.studyConfig;
    this.add('studyInstructions', this.reportEntries.length === 0 ? STUDY_INSTRUCTIONS.replaceAll('\n', '') : '');
    this.add('participantId', block.studyConfig.participantId);
    this.add('iCannotKnow', block.studyConfig.iCannotKnow);
    this.add('contextualControl', block.studyConfig.contextualControl);
    this.add('cueType', block.studyConfig.cueType);
    this.add('trialTimeoutSeconds', block.studyConfig.trialTimeoutSeconds);
    this.add('balanceEquivalence', block.studyConfig.balance.same);
    this.add('balanceLessThan', block.studyConfig.balance.lessThan);
    this.add('balanceGreaterThan', block.studyConfig.balance.greaterThan);
    this.add('balanceICannotKnow', block.studyConfig.balance.iCannotKnow ?? 0);
    this.add('blockId', block.name);
    this.add('blockAttempts', block.attempts);
    this.add('trainingAttempts', block.trainingAttempts);
    this.add('probeAttempts', block.probeAttempts);
    this.add('trialNumber', block.trialNum);
    this.add('totalTrials', block.totalTrials);
    this.add('sampleNode', block.trial.stimuli[0].toString());
    this.add('sample', block.trial.stimuli[0].value);
    this.add('comparisonNode', block.trial.stimuli[1].toString());
    this.add('comparison', block.trial.stimuli[1].value);
    this.add('correctResponse', block.trial.relation);
    this.add('button1Image', block.trial.cueComponentConfigs[0].fileName);
    this.add('button1Relation', block.trial.cueComponentConfigs[0].value);
    this.add('button2Image', block.trial.cueComponentConfigs[1].fileName);
    this.add('button2Relation', block.trial.cueComponentConfigs[1].value);
    this.add('button3Image', block.trial.cueComponentConfigs[2].fileName);
    this.add('button3Relation', block.trial.cueComponentConfigs[2].value);
    this.add('button4Image',
      block.trial.cueComponentConfigs.length >= 4 ? block.trial.cueComponentConfigs[3].fileName : 'UNDEFINED');
    this.add('button4Relation',
      block.trial.cueComponentConfigs.length >= 4 ? block.trial.cueComponentConfigs[3].value : 'UNDEFINED');
    this.add('buttonPosition', selected?.position ? selected.position : -1);
    this.add('selectedResponse', selected?.cue ? selected.cue.value : '');
    this.add('consequence', selected?.cue ? block?.feedback ? block.feedback : 'NEXT TRIAL' : 'TIME EXPIRED');
    this.add('trialStarted', selected.startedAt);
    this.add('trialCompleted', selected.completedAt);
    this.add('trialDurationInSeconds', Math.abs(selected.startedAt.getTime() - selected.completedAt.getTime()) / 1000);
    this.add('trialOutcome', selected?.cue?.value === block.trial.relation ? 'PASS' : 'FAIL');
    this.add('containsSequentialTriplicates', block.containsSequentialTriplicates ? 'TRUE' : 'FALSE');
    this.add('failSafeDuration', block.failSafeDuration.toString());
    this.add('startInstructions', block.startInstructions);
    this.add('retryInstructions', block.retryInstructions);
    this.add('studyFailed', block.studyFailed ? 'TRUE' : 'FALSE');
    this.add('sequentialCorrect', block.sequentialCorrect);
    this.reportEntries.push(this.formGroup.value);
    this.formGroup.reset();
  }

  blobToBase64(blob: Blob) {
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }

  async sendReport(status: string) {
    const studyConfig = await this.studyConfigService.studyConfig.toPromise();
    const CRLF = '\r\n';
    const report = this.reportEntries.map(
      reportEntry => Object.values(reportEntry).map(value => value?.toString() ?? '').join(';')).join(CRLF);
    const name = `MEEKU - ${studyConfig.participantId}.csv`;
    const blob = new Blob([
      status + CRLF + Object.keys(this.formGroup.value).join(';') + CRLF + report
    ], { type: 'text/csv' });
    const content = await this.blobToBase64(blob);

    init('user_OawQbiPiSgdzcdY3SkdGT');
    send('meeku-report', 'meeku-report',
      {
        attachmentName: name,
        content,
        from_name: 'Meeku Robot',
        to_name: 'Patrick',
        message: `New report has been issued! ${studyConfig.participantId}`,
        participant: name
      },
      'user_OawQbiPiSgdzcdY3SkdGT').then(function(response) {
    }, function(error) {
      console.error('Failed to send report...', error);
    });
  }

}
