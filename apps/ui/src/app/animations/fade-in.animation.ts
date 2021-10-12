import { animate, AnimationTriggerMetadata, state, style, transition, trigger } from '@angular/animations';
import { DEFAULT_DELAY, DEFAULT_DURATION } from './animation.constants';

export function fadeIn(opts?: { anchor?: string, delay?: number; duration?: number }): AnimationTriggerMetadata {
  return trigger(opts?.anchor || 'fadeIn', [
    state('void', style({ visibility: 'hidden', opacity: 0 })),
    state('false', style({ visibility: 'hidden', opacity: 0 })),
    state('true', style({ visibility: 'visible', opacity: 1 })),
    transition('* => true',
      animate('{{duration}}ms {{delay}}ms ease-in'),
      {
        params: {
          duration: opts?.duration || DEFAULT_DURATION,
          delay: opts?.delay || DEFAULT_DELAY
        }
      }
    )
  ]);
}
