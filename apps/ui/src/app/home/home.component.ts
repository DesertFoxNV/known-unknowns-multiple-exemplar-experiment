import { Component } from '@angular/core';
import { FullySpecifiedNetwork, KnownUnknownNetwork } from '../study-conditions/network';
import { StimulusCase } from '../study-conditions/stimulus-case';

@Component({
  selector: 'known-unknowns-multiple-exemplar-experiment-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
}

// for (const num of [1, 2, 3, 4, 5, 6, 7, 8, 9]) {
//   const network = new FullySpecifiedNetwork(num, StimulusCase.upper);
// }

for (const num of [1, 2, 3, 4, 5, 6, 7, 8, 9]) {
  const network = new KnownUnknownNetwork(num, StimulusCase.upper);
  console.log(network.toString());
}
