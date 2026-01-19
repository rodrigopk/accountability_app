/**
 * Navigation hook that screens use. This provides semantic navigation methods
 * that abstract away the underlying navigation library.
 */
import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useRef } from 'react';

import { NavigationService, RoundDetailParams, WizardScreenName } from './NavigationService';
import { reactNavigationService } from './ReactNavigationService';
import { CreateRoundStackParamList } from './types';

// Singleton navigation service - can be swapped to RNN implementation in Phase 2
let navigationService: NavigationService = reactNavigationService;

/**
 * Set the navigation service implementation.
 * Called at app startup to configure which navigation library to use.
 */
export function setNavigationService(service: NavigationService) {
  navigationService = service;
}

/**
 * Get the current navigation service instance.
 * Useful for imperative navigation outside of React components.
 */
export function getNavigationService(): NavigationService {
  return navigationService;
}

/**
 * Hook for screens to use navigation with semantic method names.
 * All navigation goes through the abstraction layer.
 */
export function useAppNavigation() {
  const goToRoundDetail = useCallback((params: RoundDetailParams) => {
    navigationService.push('RoundDetail', params);
  }, []);

  const goBack = useCallback(() => {
    navigationService.pop();
  }, []);

  const openCreateWizard = useCallback(() => {
    navigationService.showWizard();
  }, []);

  const closeWizard = useCallback(() => {
    navigationService.dismissWizard();
  }, []);

  return {
    goToRoundDetail,
    goBack,
    openCreateWizard,
    closeWizard,
  };
}

/**
 * Hook for wizard screens to navigate between wizard steps.
 * This must be called from within a wizard screen (inside the wizard's Stack.Navigator)
 * so that useNavigation() returns the correct navigator context.
 */
export function useWizardNavigation() {
  // Get the navigation from the current screen's context (inside wizard's Stack.Navigator)
  const navigation =
    useNavigation<import('@react-navigation/native').NavigationProp<CreateRoundStackParamList>>();

  const goToWizardStep = useCallback(
    (step: WizardScreenName) => {
      navigation.navigate(step as keyof CreateRoundStackParamList);
    },
    [navigation],
  );

  const goBackWizard = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const closeWizard = useCallback(() => {
    // Use the root navigator to dismiss the modal
    navigationService.dismissWizard();
  }, []);

  return {
    goToWizardStep,
    goBackWizard,
    closeWizard,
  };
}

/**
 * Hook to execute a callback when the screen comes into focus.
 */
export function useOnScreenFocus(callback: () => void) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    // Call immediately on mount
    callbackRef.current();

    // Subscribe to focus events
    const unsubscribe = navigationService.onScreenFocus(() => {
      callbackRef.current();
    });

    return unsubscribe;
  }, []);
}
