import * as React from 'react';
import { NavigationContainerRef, TabActions } from '@react-navigation/native'; // Import TabActions

// Define a type for the routes in the reset method
type ResetRoute = {
  name: string;
};

// Define the navigationRef with a more specific type
export const navigationRef = React.createRef<NavigationContainerRef<any>>();

export function logoutNavigate() {
  console.log('Attempting to navigate on logout...');
  if (navigationRef.current) {
    const jumpToAction = TabActions.jumpTo('scan');
    navigationRef.current.dispatch(jumpToAction);
  } else {
    console.log('Navigation ref is not available');
  }
}
