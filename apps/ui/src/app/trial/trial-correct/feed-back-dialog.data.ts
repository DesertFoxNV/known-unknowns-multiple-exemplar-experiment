export interface FeedBackDialogData {
  animationParams: {
    delay: number
    duration: number
  }
  durationMs: number;
  feedback: 'CORRECT'|'WRONG'|'TIME EXPIRED';
}
