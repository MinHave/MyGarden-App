import { Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import auth from '@/store/auth';
import ui from '@/store/ui';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [uiUpdateTrigger, setUiUpdateTrigger] = useState(0);

  useEffect(() => {
    // Register the callback
    ui.registerUpdateUICallback((value) => {
      console.log('UI update callback triggered', value);
      // Update the state to trigger a re-render
      setUiUpdateTrigger((prev) => prev + 1); // Increment to ensure change
    });

    // Cleanup the callback on component unmount
    return () => ui.registerUpdateUICallback(() => {});
  }, []);

  return (
    <Tabs
      initialRouteName="scan" // Set the initial screen to "scan"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="plants"
        options={{
          href: auth.isAuthorized() ? 'plants' : null,
          title: 'Garden',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? 'leaf' : 'leaf-outline'}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: 'Scan',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              // Change this to camera icons
              name={focused ? 'scan' : 'scan-outline'}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? 'settings' : 'settings-outline'}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
