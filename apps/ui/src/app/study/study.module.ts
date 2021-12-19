import { CommonModule } from '@angular/common';
import { InjectionToken, NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { BlockModule } from '../block/block.module';
import { ForcedChoiceBlockModule } from '../block/forced-choice-block-component/forced-choice-block.module';
import { OperantChoiceBlockModule } from '../block/operant-choice-block-component/operant-choice-block.module';
import { PreTestBlockModule } from '../block/pre-test-block-component/pre-test-block.module';
import { TrainingNetworksBlockModule } from '../block/training-networks-block-component/training-networks-block.module';
import { Network1And2Graph } from '../graph/network-1-and-2-graph';
import { Network3And4Graph } from '../graph/network-3-and-4-graph';
import { Network5And6Graph } from '../graph/network-5-and-6-graph';
import { randomStimulusCase } from '../study-conditions/random-stimulus-case';
import { SurveyModule } from '../survey/survey.module';

import { StudyRoutingModule } from './study-routing.module';
import { StudyComponent } from './study.component';

export const STIMULUS_CASE = new InjectionToken('Stimulus case');

@NgModule({
  declarations: [
    StudyComponent
  ],
  exports: [
    StudyComponent
  ],
  imports: [
    BlockModule,
    CommonModule,
    ForcedChoiceBlockModule,
    MatButtonModule,
    MatCardModule,
    OperantChoiceBlockModule,
    PreTestBlockModule,
    StudyRoutingModule,
    SurveyModule,
    TrainingNetworksBlockModule
  ],
  providers: [
    Network1And2Graph,
    Network3And4Graph,
    Network5And6Graph,
    { provide: STIMULUS_CASE, useValue: randomStimulusCase() }
  ]
})
export class StudyModule {}
