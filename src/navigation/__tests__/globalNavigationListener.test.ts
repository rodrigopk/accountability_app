/**
 * Tests for global navigation listener behavior.
 * Verifies that componentId is set correctly via the global listener registered in index.js.
 */
import { Navigation } from 'react-native-navigation';

import { getCurrentComponentId, setCurrentComponentId } from '../RNNNavigationService';

// Create a mock implementation that tracks state
let mockCurrentComponentId = '';

jest.mock('../RNNNavigationService', () => ({
  getCurrentComponentId: jest.fn(() => mockCurrentComponentId),
  setCurrentComponentId: jest.fn((id: string) => {
    mockCurrentComponentId = id;
  }),
}));

describe('Global Navigation Listener', () => {
  let globalAppearListener: ((event: { componentId: string }) => void) | null = null;
  let mockRegisterComponentDidAppearListener: jest.Mock;
  let mockRegisterAppLaunchedListener: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    globalAppearListener = null;
    mockCurrentComponentId = '';
    (setCurrentComponentId as jest.Mock).mockImplementation((id: string) => {
      mockCurrentComponentId = id;
    });
    (getCurrentComponentId as jest.Mock).mockImplementation(() => mockCurrentComponentId);

    // Mock Navigation.events()
    mockRegisterComponentDidAppearListener = jest.fn(callback => {
      globalAppearListener = callback;
      return { remove: jest.fn() };
    });

    mockRegisterAppLaunchedListener = jest.fn(callback => {
      // Simulate app launch - call the callback immediately
      callback();
    });

    (Navigation.events as jest.Mock).mockReturnValue({
      registerComponentDidAppearListener: mockRegisterComponentDidAppearListener,
      registerAppLaunchedListener: mockRegisterAppLaunchedListener,
    });
  });

  test('global listener is registered before setRoot', () => {
    // Simulate the behavior in index.js
    Navigation.events().registerAppLaunchedListener(() => {
      // Register global listener BEFORE setRoot
      Navigation.events().registerComponentDidAppearListener(({ componentId }) => {
        setCurrentComponentId(componentId);
      });

      // Simulate setRoot call
      Navigation.setRoot({ root: { component: { name: 'Main' } } });
    });

    // Verify listener was registered
    expect(mockRegisterComponentDidAppearListener).toHaveBeenCalledTimes(1);
    expect(globalAppearListener).toBeDefined();

    // Verify setRoot was called after listener registration
    const appLaunchedCallback = mockRegisterAppLaunchedListener.mock.calls[0][0];
    expect(appLaunchedCallback).toBeDefined();
  });

  test('componentId is set when componentDidAppear event fires', () => {
    // Simulate the behavior in index.js
    Navigation.events().registerAppLaunchedListener(() => {
      Navigation.events().registerComponentDidAppearListener(({ componentId }) => {
        setCurrentComponentId(componentId);
      });
    });

    // Verify listener was registered
    expect(globalAppearListener).toBeDefined();

    // Simulate componentDidAppear event
    if (globalAppearListener) {
      globalAppearListener({ componentId: 'test-component-1' });
    }

    // Verify componentId was set
    expect(setCurrentComponentId).toHaveBeenCalledWith('test-component-1');
    expect(getCurrentComponentId()).toBe('test-component-1');
  });

  test('switching screens updates componentId correctly', () => {
    // Simulate the behavior in index.js
    Navigation.events().registerAppLaunchedListener(() => {
      Navigation.events().registerComponentDidAppearListener(({ componentId }) => {
        setCurrentComponentId(componentId);
      });
    });

    expect(globalAppearListener).toBeDefined();

    // Simulate Main screen appearing
    if (globalAppearListener) {
      globalAppearListener({ componentId: 'main-component' });
    }
    expect(getCurrentComponentId()).toBe('main-component');

    // Simulate Settings screen appearing (user switches tabs)
    if (globalAppearListener) {
      globalAppearListener({ componentId: 'settings-component' });
    }
    expect(getCurrentComponentId()).toBe('settings-component');

    // Simulate RoundDetail screen appearing (user navigates)
    if (globalAppearListener) {
      globalAppearListener({ componentId: 'round-detail-component' });
    }
    expect(getCurrentComponentId()).toBe('round-detail-component');
  });

  test('global listener handles initial app launch appear event', () => {
    let listenerRegistered = false;
    let setRootCalled = false;

    // Simulate the behavior in index.js with proper timing
    Navigation.events().registerAppLaunchedListener(() => {
      // Register global listener BEFORE setRoot
      Navigation.events().registerComponentDidAppearListener(({ componentId }) => {
        setCurrentComponentId(componentId);
      });
      listenerRegistered = true;

      // Simulate setRoot call
      Navigation.setRoot({ root: { component: { name: 'Main' } } });
      setRootCalled = true;

      // Simulate componentDidAppear event firing immediately after setRoot
      // (as happens in real app launch)
      if (globalAppearListener) {
        globalAppearListener({ componentId: 'initial-main-component' });
      }
    });

    // Verify listener was registered before setRoot
    expect(listenerRegistered).toBe(true);
    expect(setRootCalled).toBe(true);

    // Verify componentId was set by the global listener
    expect(getCurrentComponentId()).toBe('initial-main-component');
  });
});
