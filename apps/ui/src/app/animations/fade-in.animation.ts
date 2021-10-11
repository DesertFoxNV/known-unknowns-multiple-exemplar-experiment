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

export function fade(opts?: { anchor?: string, fadeIn?: { delay?: number; duration?: number }, fadeOut?: { delay?: number; duration?: number } }): AnimationTriggerMetadata {
  const DEFAULT_FADE_IN_DURATION = 2000;
  const DEFAULT_FADE_IN_DELAY = 0;
  const DEFAULT_FADE_OUT_DURATION = 2000;
  const DEFAULT_FADE_OUT_DELAY = 0;
  return trigger(opts?.anchor || 'fade', [
    state('void', style({ opacity: 0 })),
    state('false', style({ opacity: 0 })),
    state('true', style({ opacity: 1 })),
    transition('* => true',
      animate('{{fadeInDuration}}ms {{fadeInDelay}}ms ease-in'),
      {
        params: {
          fadeInDuration: opts?.fadeIn?.duration || DEFAULT_FADE_IN_DURATION,
          fadeInDelay: opts?.fadeIn?.delay || DEFAULT_FADE_IN_DELAY
        }
      }
    ),
    transition('true => false',
      animate('{{fadeOutDuration}}ms {{fadeOutDelay}}ms ease-out'),
      {
        params: {
          fadeOutDuration: opts?.fadeOut?.duration || DEFAULT_FADE_OUT_DURATION,
          fadeOutDelay: opts?.fadeOut?.delay || DEFAULT_FADE_OUT_DELAY
        }
      })
  ]);
}
