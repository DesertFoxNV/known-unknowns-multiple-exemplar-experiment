import { ComponentType } from '@angular/cdk/overlay';
import { DOCUMENT } from '@angular/common';
import { Component, ComponentFactoryResolver, Inject, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { fromEvent, timer } from 'rxjs';
import { filter, first, switchMap, tap } from 'rxjs/operators';
import {
  BlockButtonDialogComponent, BlockButtonDialogData
} from '../block/block-button-dialog/block-button-dialog.component';
import { BlockComponent } from '../block/block.component';
import { ForcedChoiceBlockComponent } from '../block/forced-choice-block-component/forced-choice-block.component';
import { fullScreenDialogWithData } from '../block/full-screen-dialog-with-data';
import { OperantChoiceBlockComponent } from '../block/operant-choice-block-component/operant-choice-block.component';
import { PreTestBlockComponent } from '../block/pre-test-block-component/pre-test-block.component';
import {
  TrainingNetworksBlockComponent
} from '../block/training-networks-block-component/training-networks-block.component';
import { TRIAL_DELAY_INTERVAL_MS } from '../block/trial-animation-delay';
import { ReportStatus } from '../report/report-status';
import { ReportService } from '../report/report.service';
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
  complete = false;
  @ViewChild('container', { read: ViewContainerRef, static: true }) container?: ViewContainerRef;
  instructions = STUDY_INSTRUCTIONS;
  preSurveyCompleted = false;
  showInstructions = true;
  studyConfig?: StudyConfig;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private componentFactoryResolver: ComponentFactoryResolver,
    private dialog: MatDialog,
    private reportSvc: ReportService,
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

    blockInstance.completed.pipe(first(), tap(({ failed }) => {
      if (failed) {
        this.showCompleteDialog(`THANKS FOR PARTICIPATING!\n\n PARTICIPANT ID:\n ${this.studyConfig?.participantId}`,
          'failed');
      } else if (this.blocks.length) {
        this.nextBlock();
        this.reportSvc.sendReport('block');
      } else {
        this.showCompleteDialog(`THANKS FOR PARTICIPATING!\n\n PARTICIPANT ID:\n ${this.studyConfig?.participantId}`,
          'complete');
      }
    }), untilDestroyed(this)).subscribe();

  }

  nextBlock() {
    this.showInstructions = false;
    const block = this.blocks.shift();
    if (!block) throw Error('Block is undefined');
    this.createBlockComponent(block);
  }

  ngOnInit() {

    this.studyConfigSvc.studyConfig.pipe(tap((studyConfig) => this.studyConfig = studyConfig)).subscribe();

    fromEvent(document, 'visibilitychange').pipe(
      filter(() => document.hidden),
      first(),
      tap(() => {
        this.container?.clear();
        this.showCompleteDialog(`STUDY ABANDONED!\n\n PARTICIPANT ID:\n ${this.studyConfig?.participantId}`,
          'abandoned');
      })
    ).subscribe();
  }

  popupwindow(url: string, title: string, w: number, h: number) {
    return window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, '
      + 'menubar=no, scrollbars=yes, resizable=no, copyhistory=no');
  }

  showCompleteDialog(text: string, status: ReportStatus) {
    this.complete = true;
    this.container?.clear();
    timer(TRIAL_DELAY_INTERVAL_MS).pipe(
      first(),
      switchMap(() => {
        this.showPostSurvey()
        return this.reportSvc.sendReport(status)
      }),
      switchMap(() => this.dialog.open(BlockButtonDialogComponent,
        fullScreenDialogWithData<BlockButtonDialogData>({ text, disableClose: true })).afterClosed())
    ).subscribe();
  }

  showPostSurvey() {
    const survey = this.popupwindow(
      'https://docs.google.com/forms/d/e/1FAIpQLSczKoo6Uf1wy11LoWiwvIcECIjoZy3YdAA-bCzNVDZtpxvAFg/viewform?embedded=true',
      'Survey', 500, 500);
    if (!survey) throw Error('Survey windows is undefined');
    const timer = setInterval(() => {
      if (survey.closed) {
        clearInterval(timer);
      }
      this.preSurveyCompleted = true;
    }, 100);
  }

  showPreSurvey() {
    const survey = this.popupwindow(
      'https://docs.google.com/forms/d/e/1FAIpQLSfUjqCloWRFFmtxktYAz-vnNuoo-YpdY1rpuS8bNAM7JiK9Jw/viewform?embedded=true',
      'Survey', 500, 500);
    if (!survey) throw Error('Survey windows is undefined');
    const timer = setInterval(() => {
      if (survey.closed) {
        clearInterval(timer);
      }
      this.preSurveyCompleted = true;
    }, 100);
  }

}
