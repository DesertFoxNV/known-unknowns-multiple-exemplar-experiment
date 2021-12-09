import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OverlayService {
  private visible = new BehaviorSubject(false);
  visible$ = this.visible.asObservable();

  hide() {
    this.visible.next(false);
  }

  show(delayMs: number) {
    setTimeout(() => this.visible.next(true), delayMs);
  }
}
