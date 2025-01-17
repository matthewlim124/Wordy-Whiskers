import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    PublicPixel: require('../assets/fonts/PublicPixel-eZPz6.ttf'),
    Press2P: require('../assets/fonts/PressStart2P-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(lab)" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="signIn" options={{
                        headerTitle: 'Sign In',
                        headerTitleStyle: {
                            fontFamily: 'Press2P', // Use the custom font for the header title
                            fontSize: 16,
                        },
                        headerStyle: {
                            backgroundColor: 'skyblue', // Set the header background color
                            height: 80, // Increase the header height (optional)
                            paddingTop: 20, // Add padding to the top (optional)
                        },
                        headerTintColor: 'white', // Set the header text color
                        headerTitleAlign: 'left', // Align the title to the left
                    }} />
        <Stack.Screen name="rules" options={{
                        headerTitle: 'Rules',
                        headerTitleStyle: {
                            fontFamily: 'Press2P', // Use the custom font for the header title
                            fontSize: 16,
                        },
                        headerStyle: {
                            backgroundColor: 'skyblue', // Set the header background color
                            height: 80, // Increase the header height (optional)
                            paddingTop: 20, // Add padding to the top (optional)
                        },
                        headerTintColor: 'white', // Set the header text color
                        headerTitleAlign: 'left', // Align the title to the left
                    }} />
        

        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
