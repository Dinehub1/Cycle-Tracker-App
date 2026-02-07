import {
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  useFonts,
} from '@expo-google-fonts/manrope';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect } from 'react';
import { View } from 'react-native';
import 'react-native-reanimated';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync().catch(() => {
  // Splash screen may already be hidden
});

// Custom light theme matching Stitch design
const CycleTrackerLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.light.primary,
    background: Colors.light.background,
    card: Colors.light.cardBackground,
    text: Colors.light.text,
    border: Colors.light.border,
    notification: Colors.light.primary,
  },
};

const CycleTrackerDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: Colors.dark.primary,
    background: Colors.dark.background,
    card: Colors.dark.cardBackground,
    text: Colors.dark.text,
    border: Colors.dark.border,
    notification: Colors.dark.primary,
  },
};

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [fontsLoaded, fontError] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    onLayoutRootView();
  }, [onLayoutRootView]);

  // Show nothing while loading, but allow error to proceed
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? CycleTrackerDarkTheme : CycleTrackerLightTheme}>
      <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="onboarding"
            options={{
              headerShown: false,
              presentation: 'fullScreenModal',
            }}
          />
          <Stack.Screen
            name="pin-lock"
            options={{
              headerShown: false,
              presentation: 'fullScreenModal',
            }}
          />
          <Stack.Screen
            name="log-symptoms"
            options={{
              title: 'Log Symptoms',
              presentation: 'modal',
              headerStyle: { backgroundColor: Colors.light.background },
              headerTintColor: Colors.light.primary,
            }}
          />
          <Stack.Screen
            name="notifications"
            options={{
              title: 'Notifications',
              headerStyle: { backgroundColor: Colors.light.background },
              headerTintColor: Colors.light.primary,
            }}
          />
          <Stack.Screen
            name="privacy"
            options={{
              title: 'Privacy & Security',
              headerStyle: { backgroundColor: Colors.light.background },
              headerTintColor: Colors.light.primary,
            }}
          />
          <Stack.Screen
            name="partner-sync"
            options={{
              title: 'Partner Sync',
              headerStyle: { backgroundColor: Colors.light.background },
              headerTintColor: Colors.light.primary,
            }}
          />
        </Stack>
      </View>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}
