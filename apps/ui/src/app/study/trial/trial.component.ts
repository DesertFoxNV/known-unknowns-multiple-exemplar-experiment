import { Component, Input } from '@angular/core';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { Trial } from './trial';

@Component({
  selector: 'kumee-trial',
  templateUrl: './trial.component.html',
  styleUrls: ['./trial.component.scss'],
  animations: [
    fadeInOnEnterAnimation({ anchor: 'enter'})
  ]
})
export class TrialComponent {
  @Input() trial: Trial = {
    cue1: 'DQZ',
    cue2: 'JXK'
  };
}
