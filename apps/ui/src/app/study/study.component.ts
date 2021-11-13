import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Block } from '../block/block';
import { BlockComponent } from '../block/block.component';
import { ReportService } from '../report/report.service';
import { StudyConditionService } from '../study-conditions/study-condition.service';
import { StudyConfigService } from '../study-config-form/study-config.service';
import { STUDY_INSTRUCTIONS } from './study-instructions';

@Component({
  selector: 'study',
  templateUrl: './study.component.html',
  styleUrls: ['./study.component.scss'],
  providers: []
})
export class StudyComponent implements OnInit, OnDestroy {
  block?: Block;
  @ViewChild(BlockComponent, { static: false }) blockComponent?: BlockComponent;
  blocks: Block[] = [];
  instructions = STUDY_INSTRUCTIONS;
  showInstructions = false;

  constructor(
    private conditionsSvc: StudyConditionService,
    readonly studyConfigSvc: StudyConfigService,
    private reportSvc: ReportService
  ) {
  }

  complete() {
    console.log('complete');
  }

  nextBlock() {
    // this.showInstructions = false;
    // if (!this.blockComponent) throw Error('Block component does not exist');
    // this.block = this.blocks.shift();
    // if (this.block) {
    //   this.block.start(this.blockComponent);
    //   this.reportSvc.add('blockId', this.block.name);
    // } else {
    //   this.blockComponent.prompt('THANKS FOR PARTICIPATING!', true, TRIAL_DELAY_INTERVAL_MS).subscribe();
    // }
  }

  ngOnDestroy(): void {
    // this.reportSvc.reset();
  }

  async ngOnInit(): Promise<void> {
  }

}
