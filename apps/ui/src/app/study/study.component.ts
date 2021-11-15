import { ComponentType } from '@angular/cdk/overlay';
import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { timer } from 'rxjs';
import { first, switchMap, tap } from 'rxjs/operators';
import {
  BlockButtonDialogComponent, BlockButtonDialogData
} from '../block/block-button-dialog/block-button-dialog.component';
import { BlockComponent } from '../block/block.component';
import { ForcedChoiceBlockComponent } from '../block/forced-choice-block-component/forced-choice-block.component';
import { fullScreenDialogWithData } from '../block/full-screen-dialog-with-data';
import { OperantChoiceBlockComponent } from '../block/operant-choice-block-component/operant-choice-block.component';
import { PreTestBlockComponent } from '../block/pre-test-block-component/pre-test-block.component';
import { TrainingNetworksBlockComponent } from '../block/training-networks-block-component/training-networks-block.component';
import { TRIAL_DELAY_INTERVAL_MS } from '../block/trial-animation-delay';
import { StudyConfig } from '../study-config-form/study-config';
import { StudyConfigService } from '../study-config-form/study-config.service';
import { STUDY_INSTRUCTIONS } from './study-instructions';

@UntilDestroy()
@Component({
  selector: 'study',
  templateUrl: './study.component.html',
  styleUrls: ['./study.component.scss'],
  providers: []
})
export class StudyComponent implements OnInit {
  blocks: ComponentType<BlockComponent>[] = [
    PreTestBlockComponent,
    ForcedChoiceBlockComponent,
    OperantChoiceBlockComponent,
    TrainingNetworksBlockComponent
  ];
  @ViewChild('container', { read: ViewContainerRef, static: true }) container?: ViewContainerRef;
  instructions = STUDY_INSTRUCTIONS;
  showInstructions = true;
  studyConfig?: StudyConfig;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private dialog: MatDialog,
    readonly studyConfigSvc: StudyConfigService
  ) {
  }

  createBlockComponent(blockComponent: ComponentType<BlockComponent>) {
    if (!this.container) throw Error('Container is undefined');
    if (!this.studyConfig) throw Error('Study configuration is undefined');
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(blockComponent);
    this.container.clear();
    const componentRef = this.container.createComponent(componentFactory);
    const blockInstance = componentRef.instance;
    blockInstance.studyConfig = this.studyConfig;
    blockInstance.completed.pipe(first(), tap(() => this.nextBlock()), untilDestroyed(this)).subscribe();
  }

  nextBlock() {
    this.showInstructions = false;
    const block = this.blocks.shift();
    if (block) {
      this.createBlockComponent(block);
    } else {
      this.showStudyCompleteDialog();
    }
  }

  ngOnInit() {
    this.studyConfigSvc.studyConfig.pipe(tap((studyConfig) => this.studyConfig = studyConfig)).subscribe();
  }

  showStudyCompleteDialog() {
    timer(TRIAL_DELAY_INTERVAL_MS).pipe(
      first(),
      switchMap(() => this.dialog.open(
        BlockButtonDialogComponent,
        fullScreenDialogWithData<BlockButtonDialogData>({ text: 'THANKS FOR PARTICIPATING!', disableClose: true })
      ).afterClosed())
    ).subscribe();
  }

}
