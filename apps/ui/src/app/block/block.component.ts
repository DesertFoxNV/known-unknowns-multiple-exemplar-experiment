import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StudyConditionService } from '../study-conditions/study-condition.service';
import { CueSelected } from '../trial/cue-selected';
import { nextTick } from '../trial/next-tick';
import { TrialComponent } from '../trial/trial.component';
import { Block } from './block';
import { BlockButtonDialogComponent } from './block-button-dialog/block-button-dialog.component';
import { fullScreenDialogWithData } from './full-screen-dialog-with-data';

@Component({
  selector: 'block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.scss'],
  animations: []
})
export class BlockComponent {
  block: Block|undefined;
  @Output() completed = new EventEmitter();
  conditions = this.conditionSvc.conditions;
  show = false;
  @ViewChild(TrialComponent, { static: false }) trialComponent: TrialComponent|undefined;

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

  nextTrial() {
    const trial = this.block?.nextTrial();
    console.log(trial);
    if (trial) {
      this.trialComponent?.next(trial);
    } else {
      this.dialog.open(BlockButtonDialogComponent, fullScreenDialogWithData('TRIAL COMPLETE')).afterClosed().subscribe(
        () => location.reload());
      this.show = false;
      this.completed.emit();
    }
  }

  selected($event: CueSelected|undefined) {
    console.log($event);
    this.nextTrial();
  }

  async start() {
    this.show = true;
    await nextTick();
    this.nextTrial();
  }
}
