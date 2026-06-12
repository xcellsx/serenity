import type { MoodValue } from '@/lib/db';

export type MoodOption = {
  value: MoodValue;
  label: string;
  /** Blob / dot gradient (light → deep). */
  gradient: readonly [string, string, ...string[]];
  /** Single representative color for calendar dots. */
  dot: string;
};

/**
 * Ordered as a smooth emotional spectrum (bright/light → deep/heavy) so the
 * orb's gradient morphs naturally as you sweep from one to the next.
 */
export const MOODS: MoodOption[] = [
  {
    value: 'happy',
    label: 'Happy',
    gradient: ['#FCEBD0', '#F6C56A', '#EE9A2E', '#E07C18'],
    dot: '#EE9A2E',
  },
  {
    value: 'calm',
    label: 'Calm',
    gradient: ['#FCEBD0', '#F3C9A0', '#E3A06A', '#CE8450'],
    dot: '#E3A06A',
  },
  {
    value: 'neutral',
    label: 'Okay',
    gradient: ['#F6E4CC', '#EDB489', '#C0392B', '#8B1A12'],
    dot: '#EDB489',
  },
  {
    value: 'anxious',
    label: 'Anxious',
    gradient: ['#F3D2B0', '#E08A5A', '#C44A2E', '#8E2A18'],
    dot: '#C44A2E',
  },
  {
    value: 'distressed',
    label: 'Distressed',
    gradient: ['#F3D6CE', '#D98C8C', '#B23A3A', '#7A1F2B'],
    dot: '#B23A3A',
  },
  {
    value: 'angry',
    label: 'Angry',
    gradient: ['#F0C2B0', '#D7593E', '#B0241A', '#6E140E'],
    dot: '#B0241A',
  },
];

export const moodByValue = (value: MoodValue | null) =>
  MOODS.find((m) => m.value === value);
