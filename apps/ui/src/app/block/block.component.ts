import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StudyConditionService } from '../study-conditions/study-condition.service';
import { CueSelected } from '../trial/cue-selected';
import { FeedBackDialogData } from '../trial/trial-correct/feed-back-dialog.data';
import { TrialFeedbackDialogComponent } from '../trial/trial-correct/trial-feedback-dialog.component';
import { TrialComponent } from '../trial/trial.component';
import { Block } from './block';
import { BlockButtonDialogComponent, BlockButtonDialogData } from './block-button-dialog/block-button-dialog.component';
import { fullScreenDialogWithData } from './full-screen-dialog-with-data';

@Component({
  selector: 'block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.scss'],
  animations: []
})
export class BlockComponent {
  block!: Block;
  @Output() completed = new EventEmitter();
  conditions = this.conditionSvc.conditions;
  @ViewChild(TrialComponent, { static: true }) trialComponent!: TrialComponent;

  constructor(
    readonly conditionSvc: StudyConditionService,
    private dialog: MatDialog
  ) {
  }

  cueSelected($event: CueSelected|undefined) {
    console.log($event);
    if (!this.block.showFeedback) {
      this.nextTrial();
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

  next(block: Block) {
    this.block = block;
    this.dialog.open(
      BlockButtonDialogComponent,
      fullScreenDialogWithData<BlockButtonDialogData>({ text: `CLICK TO START` })
    ).afterClosed().subscribe(() => this.nextTrial());
  }

  nextTrial() {
    const trial = this.block.nextTrial();
    console.log(trial);
    if (trial) {
      this.trialComponent.next(trial, this.block.isLastTrial);
    } else {
      this.dialog.open(
        BlockButtonDialogComponent,
        fullScreenDialogWithData({ disabled: true, text: 'TRIAL COMPLETE' })
      ).afterClosed().subscribe(
        () => this.completed.emit()
      );
    }
  }
}
