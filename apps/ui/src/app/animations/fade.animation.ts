import { animate, AnimationTriggerMetadata, style, transition, trigger } from '@angular/animations';

export function fade(): AnimationTriggerMetadata {
  return trigger('fade', [
    transition('void => *', [
      style({ opacity: 0 }),
      animate(5000, style({ opacity: 1 }))
    ]),
    transition('* => void', [
      animate(5000, style({ opacity: 0 }))
    ])
  ]);
}
