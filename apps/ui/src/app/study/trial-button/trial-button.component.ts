import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CueArbitraryFilenames, CueNonArbitrary, CueType } from '../../study-conditions/cue';

@Component({
  selector: 'kumee-trial-button',
  templateUrl: './trial-button.component.html',
  styleUrls: ['./trial-button.component.scss'],
})
export class TrialButtonComponent {
  @Input() cue: CueNonArbitrary|undefined = CueNonArbitrary.same;
  cueType = CueType;
  @Input() fileName: string|undefined = CueArbitraryFilenames.image1;
  @Output() selected = new EventEmitter<{ cue: CueNonArbitrary, position: number }>();
  @Input() type: CueType|undefined = CueType.arbitrary;
}
