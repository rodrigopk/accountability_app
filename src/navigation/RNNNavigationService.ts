/**
 * React Native Navigation (Wix) implementation of NavigationService.
 * This is used after Phase 2 migration.
 */
import { Navigation } from 'react-native-navigation';

import { NavigationService, ScreenName } from './NavigationService';

// Current component ID - updated by each screen when it appears
let currentComponentId: string = '';

/**
 * Set the current component ID. Called by screens when they mount/appear.
 */
export function setCurrentComponentId(id: string) {
  currentComponentId = id;
}

/**
 * Get the current component ID.
 */
export function getCurrentComponentId(): string {
  return currentComponentId;
}

export const rnnNavigationService: NavigationService = {
  push(screen: ScreenName, params?: Record<string, unknown>) {
    if (!currentComponentId) return;
    Navigation.push(currentComponentId, {
      component: {
        name: screen,
        passProps: params,
        options: {
          topBar: { visible: false },
        },
      },
    });
  },

  pop() {
    if (!currentComponentId) return;
    Navigation.pop(currentComponentId);
  },

  popToRoot() {
    if (!currentComponentId) return;
    Navigation.popToRoot(currentComponentId);
  },

  showModal(screen: ScreenName, params?: Record<string, unknown>) {
    Navigation.showModal({
      component: {
        name: screen,
        passProps: params,
        options: {
          topBar: { visible: false },
        },
      },
    });
  },

  dismissModal() {
    if (!currentComponentId) return;
    Navigation.dismissModal(currentComponentId);
  },

  onScreenFocus(callback: () => void) {
    const subscription = Navigation.events().registerComponentDidAppearListener(
      ({ componentId }) => {
        if (componentId === currentComponentId) {
          callback();
        }
      },
    );
    return () => subscription.remove();
  },
};
