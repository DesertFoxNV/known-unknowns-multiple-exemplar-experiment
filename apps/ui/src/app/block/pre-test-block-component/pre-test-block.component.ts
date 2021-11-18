import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { shuffle } from 'lodash-es';
import { Network3And4Graph } from '../../graph/network-3-and-4-graph';
import { ReportService } from '../../report/report.service';
import { Trial } from '../../trial/trial';
import { BlockComponent } from '../block.component';
import { randomizedComponentConfigs } from '../cue-component-configs';

@Component({
  selector: 'pre-test-block',
  templateUrl: './pre-test-block.component.html',
  styleUrls: ['./pre-test-block.component.scss'],
  animations: []
})
export class PreTestBlockComponent extends BlockComponent implements OnInit {
  name = 'Pre Test';
  private numDuplicates = 4;

  /**
   * Test Block
   *  Creates a test block with a known and unknown network.
   *  32 trials default (8 * numDuplicates trials)
   *    16 mutually entailed trials (default) = mutually-entailed (B:A, C:A) * numDuplicates (4 default) * 2 networks
   *    16 combinatorially entailed trials (default) = combinatorially-entailed (B:C, C:B) * numDuplicates  (4 default) * 2 networks
   * @param dialog
   * @param reportSvc
   * @param network3And4Graph
   */
  constructor(
    dialog: MatDialog,
    reportSvc: ReportService,
    private network3And4Graph: Network3And4Graph
  ) {
    super(dialog, reportSvc);
  }

  /**
   * Creates trials.
   * @returns {unknown[] | Array<Trial[][keyof Trial[]]>}
   */
  createTrials() {
    const { studyConfig } = this;
    if (!studyConfig) throw Error('Study configuration is undefined');

    // Mutually entailed and combinatorially entailed trials are generated for each network
    for (let i = 0; i < this.numDuplicates; i++) {
      this.trials = this.trials.concat([
          this.network3And4Graph.mutuallyEntailed,
          this.network3And4Graph.combinatoriallyEntailed
        ].flat().map(
          stimuliComparison => ({ ...stimuliComparison, cueComponentConfigs: randomizedComponentConfigs(studyConfig) })
        )
      );
    }

    // The trials are shuffled to ensure random order.
    return shuffle(this.trials);
  }

  ngOnInit(): void {
    this.start();
  }
}
