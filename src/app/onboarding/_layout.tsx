import { Stack } from 'expo-router';

import { useStackScreenOptions } from '@/hooks/use-stack-screen-options';

export default function OnboardingLayout() {
  const screenOptions = useStackScreenOptions('step');

  return <Stack screenOptions={screenOptions} />;
}
