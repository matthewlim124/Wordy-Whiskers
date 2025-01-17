import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';


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
                            fontFamily: 'Press2P',
                        },
                        headerStyle: {
                            backgroundColor: 'skyblue', 
                            height: 80, 
                            paddingTop: 20, 
                        },
                        headerTintColor: 'white', 
                        headerTitleAlign: 'left', 
                    }} />
        <Stack.Screen name="rules" options={{
                        headerTitle: 'Rules',
                        headerTitleStyle: {
                            fontFamily: 'Press2P', 
                            fontSize: 16,
                        },
                        headerStyle: {
                            backgroundColor: 'skyblue', 
                            height: 80, 
                            paddingTop: 20, 
                        },
                        headerTintColor: 'white', 
                        headerTitleAlign: 'left', 
                    }} />
        

        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
