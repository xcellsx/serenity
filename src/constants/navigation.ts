/** Calm navigation timing — slow enough to track, fast enough not to drag. */
export const MotionDurations = {
  serene: 380,
  step: 420,
  quick: 280,
} as const;

export type StackMotionVariant = 'serene' | 'step' | 'quick';
