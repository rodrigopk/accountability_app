/**
 * React Navigation implementation of NavigationService.
 * This is used during Phase 1 while React Navigation is still the underlying library.
 */
import { NavigationContainerRef } from '@react-navigation/native';
import { createRef } from 'react';

import { NavigationService, ScreenName } from './NavigationService';
import { RootStackParamList } from './types';

// Navigation ref for the root NavigationContainer
export const navigationRef = createRef<NavigationContainerRef<RootStackParamList>>();

export const reactNavigationService: NavigationService = {
  push(screen: ScreenName, params?: Record<string, unknown>) {
    if (navigationRef.current?.isReady()) {
      navigationRef.current.navigate(screen as keyof RootStackParamList, params as never);
    }
  },

  pop() {
    if (navigationRef.current?.isReady()) {
      navigationRef.current.goBack();
    }
  },

  popToRoot() {
    if (navigationRef.current?.isReady()) {
      navigationRef.current.reset({ index: 0, routes: [{ name: 'Main' }] });
    }
  },

  showModal(screen: ScreenName, params?: Record<string, unknown>) {
    // In React Navigation, modals are just screens with presentation: 'modal'
    this.push(screen, params);
  },

  dismissModal() {
    this.pop();
  },

  showWizard() {
    if (navigationRef.current?.isReady()) {
      navigationRef.current.navigate('CreateRoundWizard');
    }
  },

  dismissWizard() {
    // Dismiss the modal from the root navigator
    if (navigationRef.current?.isReady()) {
      navigationRef.current.goBack();
    }
  },

  onScreenFocus(callback: () => void) {
    if (!navigationRef.current) {
      return () => {};
    }

    const unsubscribe = navigationRef.current.addListener('state', () => {
      callback();
    });

    return unsubscribe;
  },
};
