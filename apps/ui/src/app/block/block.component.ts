import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { StudyConditionService } from '../study-conditions/study-condition.service';
import { StudyConditions } from '../study-conditions/study-conditions';
import { CueSelected } from '../trial/cue-selected';
import { nextTick } from '../trial/next-tick';
import { TrialComponent } from '../trial/trial.component';
import { Block } from './block';

@Component({
  selector: 'block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.css']
})
export class BlockComponent {
  block: Block|undefined;
  @Output() completed = new EventEmitter();
  conditions: StudyConditions;
  show: 'instructions'|'trial'|'completed' = 'instructions';
  @ViewChild(TrialComponent, { static: false }) trialComponent: TrialComponent|undefined;

  constructor(
    readonly conditionSvc: StudyConditionService
  ) {
    this.conditions = this.conditionSvc.conditions as StudyConditions;
  }

  next(block: Block) {
    this.block = block;
    console.log(this.block);
  }

  nextTrial() {
    const trial = this.block?.nextTrial();
    if (trial) {
      this.trialComponent?.next(trial);
    } else {
      this.show = 'completed';
      this.completed.emit();
    }
  }

  selected($event: CueSelected|undefined) {
    console.log($event);
    this.nextTrial();
  }

  async start() {
    this.show = 'trial';
    await nextTick();
    this.nextTrial();
  }
}
