import { Component } from '@angular/core';
import { fade } from '../animations/fade.animation';
import { OverlayService } from './overlay.service';

@Component({
  selector: 'overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.css'],
  animations: [
    fade()
  ]
})
export class OverlayComponent {
  constructor(readonly overlaySvc: OverlayService) {}
}
