import { DEFAULT_DURATION } from '../animations/animation.constants';

/**
 * Delay interval for stimuli and cues.
 * @type {number}
 */
export const TRIAL_DELAY_INTERVAL_MS = 500;

/**
 * Comparison stimuli are shown sequentially with a delay, then the cues
 * are shown all at once.
 * @type {{stimuli: number[], cues: number[]}}
 */
export const TRIAL_ANIMATION_DELAY_MS: {
  stimuli: number[],
  cues: number[]
} = {
  stimuli: [TRIAL_DELAY_INTERVAL_MS, TRIAL_DELAY_INTERVAL_MS * 2],
  cues: Array(5).fill(TRIAL_DELAY_INTERVAL_MS * 3)
};

/**
 * The total trial animation time is the largest trial delay + the default fade-in duration
 * @type {number}
 */
export const TRIAL_ANIMATION_DURATION_MS = Math.max(...Object.values(TRIAL_ANIMATION_DELAY_MS).flat()) +
  DEFAULT_DURATION;
