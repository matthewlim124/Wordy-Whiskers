import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarInactiveTintColor: 'gray', 
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            
            position: 'absolute',
          },
          default: {},
        }),
        tabBarIconStyle: {
          
          fontSize: 24,
          paddingTop: 2,
          
        },
      }}
    >
      <Tabs.Screen
        name="lab"
        options={{
          title: 'Lab',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="assignment.fill" color={color} />,
          tabBarLabelStyle: {  // Add this option
            fontFamily: 'Press2P', // Use your custom font here
            fontSize: 8,
          },
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: 'Leaderboard',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="leaderboard.fill" color={color} />,
          tabBarLabelStyle: {  
            fontFamily: 'Press2P',
            fontSize: 8,
          },
        
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
          tabBarLabelStyle: {  
            fontFamily: 'Press2P', 
            fontSize: 8,
          },
        
        }}
      />
    </Tabs>
  );
}