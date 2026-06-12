import { Stack } from 'expo-router';

import { useStackScreenOptions } from '@/hooks/use-stack-screen-options';

export default function RegulateLayout() {
  const screenOptions = useStackScreenOptions('serene');

  return <Stack screenOptions={screenOptions} />;
}
