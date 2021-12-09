import { Component, OnInit } from '@angular/core';
import { OverlayService } from './overlay.service';

@Component({
  selector: 'overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.scss']
})
export class OverlayComponent {

  constructor(public overlaySvc: OverlayService) { }

}
