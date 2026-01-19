/**
 * Navigation hook that screens use. This provides semantic navigation methods
 * that abstract away the underlying navigation library.
 */
import { useCallback, useEffect, useRef } from 'react';

import { NavigationService, RoundDetailParams, WizardScreenName } from './NavigationService';
import { rnnNavigationService } from './RNNNavigationService';

// Singleton navigation service - using RNN implementation
let navigationService: NavigationService = rnnNavigationService;

// Flag to indicate if we're using RNN (set when setNavigationService is called with RNN service)
let isUsingRNN = false;

/**
 * Set the navigation service implementation.
 * Called at app startup to configure which navigation library to use.
 */
export function setNavigationService(service: NavigationService, usingRNN = false) {
  navigationService = service;
  isUsingRNN = usingRNN;
}

/**
 * Get the current navigation service instance.
 * Useful for imperative navigation outside of React components.
 */
export function getNavigationService(): NavigationService {
  return navigationService;
}

/**
 * Check if we're using React Native Navigation.
 */
export function isRNNActive(): boolean {
  return isUsingRNN;
}

/**
 * Hook for screens to use navigation with semantic method names.
 * All navigation goes through the abstraction layer.
 */
export function useAppNavigation() {
  const goToRoundDetail = useCallback((params: RoundDetailParams) => {
    navigationService.push('RoundDetail', params as unknown as Record<string, unknown>);
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
 * Uses the navigation service which works with both React Navigation and RNN.
 */
export function useWizardNavigation() {
  const goToWizardStep = useCallback((step: WizardScreenName) => {
    navigationService.pushWizardStep(step);
  }, []);

  const goBackWizard = useCallback(() => {
    navigationService.popWizardStep();
  }, []);

  const closeWizard = useCallback(() => {
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
 * Supports both sync and async callbacks.
 */
export function useOnScreenFocus(callback: () => void | Promise<void>) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    // Call immediately on mount
    const result = callbackRef.current();
    // Handle async callbacks
    if (result instanceof Promise) {
      result.catch(err => console.error('Error in useOnScreenFocus callback:', err));
    }

    // Subscribe to focus events
    const unsubscribe = navigationService.onScreenFocus(() => {
      const focusResult = callbackRef.current();
      // Handle async callbacks
      if (focusResult instanceof Promise) {
        focusResult.catch(err => console.error('Error in useOnScreenFocus callback:', err));
      }
    });

    return unsubscribe;
  }, []);
}
