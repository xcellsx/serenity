import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';

import { Fonts } from '@/constants/theme';
import { useTabScreenOptions } from '@/hooks/use-tab-screen-options';
import { useTheme } from '@/hooks/use-theme';

export default function TabsLayout() {
  const theme = useTheme();
  const tabAnimation = useTabScreenOptions();

  return (
    <Tabs
      screenOptions={{
        ...tabAnimation,
        headerShown: false,
        sceneStyle: { backgroundColor: 'transparent' },
        tabBarActiveTintColor: theme.tabActive,
        tabBarInactiveTintColor: theme.tabInactive,
        tabBarLabelStyle: { fontFamily: Fonts.sans, fontSize: 11 },
        tabBarStyle: {
          position: 'absolute',
          borderTopWidth: 0,
          elevation: 0,
          backgroundColor: Platform.OS === 'ios' ? 'transparent' : theme.background,
          height: Platform.OS === 'ios' ? 84 : 64,
        },
        tabBarBackground: () => null,
      }}>
      <Tabs.Screen
        name="mood"
        options={{
          title: 'mood',
          tabBarIcon: ({ color, size }) => <Feather name="smile" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="energy"
        options={{
          title: 'energy',
          tabBarIcon: ({ color, size }) => <Feather name="zap" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: 'tasks',
          tabBarIcon: ({ color, size }) => <Feather name="list" color={color} size={size} />,
        }}
        listeners={() => ({
          tabPress: (e) => {
            e.preventDefault();
            router.replace('/(tabs)/tasks');
          },
        })}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'profile',
          tabBarIcon: ({ color, size }) => <Feather name="user" color={color} size={size} />,
        }}
      />
      <Tabs.Screen name="calendar" options={{ href: null }} />
      <Tabs.Screen name="regulate" options={{ href: null }} />
      <Tabs.Screen name="accomplish" options={{ href: null }} />
    </Tabs>
  );
}
