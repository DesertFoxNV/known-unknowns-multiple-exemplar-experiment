import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { OverlayService } from '../overlay/overlay.service';
import { StudyConditionService } from '../study-conditions/study-condition.service';
import { StudyConditions } from '../study-conditions/study-conditions';
import { CueSelected } from '../trial/cue-selected';
import { nextTick } from '../trial/next-tick';
import { TrialComponent } from '../trial/trial.component';
import { Block } from './block';

@Component({
  selector: 'block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.scss'],
  animations: []
})
export class BlockComponent {
  block: Block|undefined;
  @Output() completed = new EventEmitter();
  conditions: StudyConditions;
  show = false;
  @ViewChild(TrialComponent, { static: false }) trialComponent: TrialComponent|undefined;

  constructor(
    readonly conditionSvc: StudyConditionService,
    private overlaySvc: OverlayService
  ) {
    this.conditions = this.conditionSvc.conditions as StudyConditions;
  }

  next(block: Block) {
    this.block = block;
    console.log(this.block);
    this.overlaySvc.show('CLICK TO START').close.subscribe(() => this.start());
  }

  nextTrial() {
    const trial = this.block?.nextTrial();
    if (trial) {
      this.trialComponent?.next(trial);
    } else {
      this.overlaySvc.show('COMPLETE').close.subscribe(() => location.reload());
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
