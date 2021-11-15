import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  SAME_DIFFERENT_ICK_GRAPH_CONFIG, SAME_DIFFERENT_ICK_GRAPH_CONFIG_VALUE
} from './same-different-ick-graph-config';
import { SAME_GT_LT_ICK_GRAPH_CONFIG, SAME_GT_LT_ICK_GRAPH_CONFIG_VALUE } from './same-gt-lt-ick-graph-config';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    { provide: SAME_DIFFERENT_ICK_GRAPH_CONFIG, useValue: SAME_DIFFERENT_ICK_GRAPH_CONFIG_VALUE },
    { provide: SAME_GT_LT_ICK_GRAPH_CONFIG, useValue: SAME_GT_LT_ICK_GRAPH_CONFIG_VALUE }
  ]
})
export class GraphModule {}
