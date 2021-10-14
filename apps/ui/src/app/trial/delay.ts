import { timer } from 'rxjs';

export function delay(ms: number) {
  return timer(ms).toPromise();
}
