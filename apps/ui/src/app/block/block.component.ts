import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {StudyConditionService} from '../study-conditions/study-condition.service';
import {CueSelected} from '../trial/cue-selected';
import {TrialComponent} from '../trial/trial.component';
import {Block} from './block';
import {BlockButtonDialogComponent} from './block-button-dialog/block-button-dialog.component';
import {fullScreenDialogWithData} from './full-screen-dialog-with-data';
import {TrialFeedbackDialogComponent} from "../trial/trial-correct/trial-feedback-dialog.component";
import {FeedBackDialogData} from "../trial/trial-correct/feed-back-dialog.data";

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
  @ViewChild(TrialComponent, {static: false}) trialComponent: TrialComponent | undefined;

  constructor(
    readonly conditionSvc: StudyConditionService,
    private dialog: MatDialog
  ) {
  }

  next(block: Block) {
    this.block = block;
    console.log(this.block);
    this.dialog.open(
      BlockButtonDialogComponent,
      fullScreenDialogWithData(`CLICK TO START`)
    ).afterClosed().subscribe(() => this.nextTrial());
  }

  nextTrial() {
    const trial = this.block?.nextTrial();
    console.log(trial);
    if (trial) {
      this.trialComponent?.next(trial);
    } else {
      this.dialog.open(
        BlockButtonDialogComponent,
        fullScreenDialogWithData('TRIAL COMPLETE')
      ).afterClosed().subscribe(
        () => this.completed.emit()
      );
    }
  }

  cueSelected($event: CueSelected | undefined) {
    console.log($event);
    if (!this.block?.showFeedback) {
      this.nextTrial()
    } else {
      this.dialog.open(
        TrialFeedbackDialogComponent,
        fullScreenDialogWithData<FeedBackDialogData>(
          {
            feedback: $event ? 'CORRECT' : 'TIME EXPIRED',
            next: () => this.nextTrial()
          }
        ));
    }
  }
}
