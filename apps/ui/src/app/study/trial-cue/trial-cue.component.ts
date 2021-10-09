import { Component, Input } from '@angular/core';

@Component({
  selector: 'kumee-trial-cue',
  templateUrl: './trial-cue.component.html',
  styleUrls: ['./trial-cue.component.scss']
})
export class TrialCueComponent {

  @Input() cue: string|undefined;

}
