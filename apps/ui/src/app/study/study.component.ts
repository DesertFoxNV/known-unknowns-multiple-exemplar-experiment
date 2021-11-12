import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Block } from '../block/block';
import { BlockComponent } from '../block/block.component';
import { TRIAL_DELAY_INTERVAL_MS } from '../block/trial-animation-delay';
import { ReportService } from '../report/report.service';
import { StudyConditionService } from '../study-conditions/study-condition.service';
import { StudyConfig } from '../study-config-form/study-config';
import { STUDY_INSTRUCTIONS } from './study-instructions';

@Component({
  selector: 'study',
  templateUrl: './study.component.html',
  styleUrls: ['./study.component.scss']
})
export class StudyComponent implements OnInit, OnDestroy {
  block?: Block;
  @ViewChild(BlockComponent, { static: true }) blockComponent?: BlockComponent;
  blocks: Block[] = [];
  config: StudyConfig|undefined;
  instructions = STUDY_INSTRUCTIONS;
  showInstructions = true;

  constructor(
    private conditionsSvc: StudyConditionService,
    private reportSvc: ReportService
  ) {
  }

  nextBlock() {
    this.showInstructions = false;
    if (!this.blockComponent) throw Error('Block component does not exist');
    this.block = this.blocks.shift();
    if (this.block) {
      this.block.start(this.blockComponent);
      this.reportSvc.add('blockId', this.block.name);
    } else {
      this.blockComponent.prompt('THANKS FOR PARTICIPATING!', true, TRIAL_DELAY_INTERVAL_MS).subscribe();
    }
  }

  ngOnDestroy(): void {
    this.reportSvc.reset();
  }

  async ngOnInit(): Promise<void> {
    this.blocks = await this.conditionsSvc.blocks$().toPromise();
  }

}
