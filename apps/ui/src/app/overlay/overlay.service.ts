import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { delay, filter, first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OverlayService {
  show$ = new BehaviorSubject<boolean>(false);
  value$ = new BehaviorSubject<string>('');

  hide() {
    this.show$.next(false);
    this.value$.next('');
  }

  show(value: string) {
    this.value$.next(value);
    this.show$.next(true);
    return {
      close: this.show$.pipe(filter(show => !show), first(), delay(1000))
    };
  }
}
