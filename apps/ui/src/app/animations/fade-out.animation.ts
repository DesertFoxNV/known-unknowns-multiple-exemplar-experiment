import {animate, AnimationTriggerMetadata, state, style, transition, trigger} from '@angular/animations';
import {DEFAULT_DELAY, DEFAULT_DURATION} from './animation.constants';

export function fadeOut(opts?: { anchor?: string, delay?: number; duration?: number }): AnimationTriggerMetadata {
  return trigger(opts?.anchor || 'fadeOut', [
    state('false', style({visibility: 'visible', opacity: 1})),
    state(':leave', style({visibility: 'visible', opacity: 1})),
    state('true', style({visibility: 'hidden', opacity: 0})),
    transition('void => *', animate(0)),
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
