import * as React from 'react';
import { NavigationContainerRef } from '@react-navigation/native'; // Assuming you're using React Navigation v5 or v6

// Define a type for the routes in the reset method
type ResetRoute = {
  name: string;
};

// Define the navigationRef with a more specific type
export const navigationRef = React.createRef<NavigationContainerRef<any>>();

export function logoutNavigate() {
  // Ensure navigationRef.current is not null before calling reset
  if (navigationRef.current) {
    navigationRef.current.reset({
      index: 0,
      routes: [{ name: 'settings' }] as ResetRoute[],
    });
  }
}
