import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StudyConditionService } from '../study-conditions/study-condition.service';
import { Trial } from '../trial/trial';
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
  @ViewChild(TrialComponent, { static: false }) trialComponent?: TrialComponent;
  isVisible = true;

  constructor(
    readonly conditionSvc: StudyConditionService,
    private dialog: MatDialog
  ) {
  }

  next(block: Block) {
    this.block = block;
    this.block.start(this);
  }

  showFeedback(feedback: string) {
    this.dialog.open(
      TrialFeedbackDialogComponent,
      fullScreenDialogWithData<FeedBackDialogData>(
        {
          feedback,
          next: () => this.block.nextTrial()
        }
      ));
  }

  showMessage(text: string, disableClose = false) {
    this.dialog.open(
      BlockButtonDialogComponent,
      fullScreenDialogWithData<BlockButtonDialogData>({ text, disableClose })
    ).afterClosed().subscribe(() => this.block.nextTrial());
  }

  showTrial(trial: Trial) {
    this.trialComponent?.show(trial);
  }

  setVisibility(isVisible: boolean) {
    this.isVisible = isVisible;
  }
}
