import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {StudyConditionService} from '../study-conditions/study-condition.service';
import {CueSelected} from '../trial/cue-selected';
import {delay} from '../trial/delay';
import {FADE_OUT_DURATION} from '../trial/fade-out-duration';
import {nextTick} from '../trial/next-tick';
import {TrialFeedbackDialogComponent} from '../trial/trial-correct/trial-feedback-dialog.component';
import {TrialComponent} from '../trial/trial.component';
import {Block} from './block';
import {BlockButtonDialogComponent} from './block-button-dialog/block-button-dialog.component';
import {fullScreenDialogWithData} from './full-screen-dialog-with-data';

@Component({
  selector: 'block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.scss'],
  animations: []
})
export class BlockComponent {
  block: Block | undefined;
  @Output() completed = new EventEmitter();
  conditions = this.conditionSvc.conditions;
  show = false;
  @ViewChild(TrialComponent, {static: false}) trialComponent: TrialComponent | undefined;

  constructor(
    readonly conditionSvc: StudyConditionService,
    private dialog: MatDialog
  ) {
  }

  next(block: Block) {
    this.block = block;
    console.log(this.block);
    this.dialog.open(BlockButtonDialogComponent, fullScreenDialogWithData(`CLICK TO START`)
    ).afterClosed().subscribe(() => this.start());
  }

  async nextTrial() {
    const trial = this.block?.nextTrial();
    console.log(trial);
    if (trial) {
      this.trialComponent?.next(trial);
    } else {
      this.show = false;
      await delay(1500);
      this.dialog.open(BlockButtonDialogComponent, fullScreenDialogWithData('TRIAL COMPLETE')).afterClosed().subscribe(
        () => this.completed.emit());
    }
  }

  async selected($event: CueSelected | undefined) {
    if (this.block?.showFeedback) {
      this.dialog.open(TrialFeedbackDialogComponent, fullScreenDialogWithData($event ? 'CORRECT' : 'TIME EXPIRED')).afterClosed().subscribe();
      setTimeout(() => {
        this.nextTrial();
      }, 3000 - (FADE_OUT_DURATION * 2));
    } else {
      setTimeout(() => {
        this.nextTrial();
      }, 3000 - (FADE_OUT_DURATION * 2));
    }
  }

  async start() {
    this.show = true;
    await nextTick();
    this.nextTrial().then();
  }
}
