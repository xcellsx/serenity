import {
  Parkinsans_400Regular,
  Parkinsans_500Medium,
  Parkinsans_700Bold,
} from '@expo-google-fonts/parkinsans';
import { Prata_400Regular } from '@expo-google-fonts/prata';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AnimatedIntro } from '@/components/animated-intro';
import { useStackScreenOptions } from '@/hooks/use-stack-screen-options';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider } from '@/lib/auth';
import { MotionProvider } from '@/lib/motion-context';
import { ThemePreferenceProvider } from '@/lib/theme-context';

SplashScreen.preventAutoHideAsync();

function Navigation() {
  const scheme = useColorScheme();
  const screenOptions = useStackScreenOptions('serene');

  return (
    <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={screenOptions}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    Prata_400Regular,
    Parkinsans_400Regular,
    Parkinsans_500Medium,
    Parkinsans_700Bold,
  });
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <ThemePreferenceProvider>
          {!introDone ? (
            <AnimatedIntro onDone={() => setIntroDone(true)} />
          ) : (
            <MotionProvider>
              <Navigation />
            </MotionProvider>
          )}
        </ThemePreferenceProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
