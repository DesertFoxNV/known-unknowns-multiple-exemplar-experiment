import { timer } from 'rxjs';

export function nextTick() {
  return timer(1).toPromise();
}

