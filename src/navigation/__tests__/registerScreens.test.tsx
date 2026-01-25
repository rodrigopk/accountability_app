/**
 * Tests for screen registration.
 * Verifies that screens are properly registered and wrapped with providers.
 */
import { render } from '@testing-library/react-native';
import React from 'react';
import { Navigation } from 'react-native-navigation';

import { registerScreens } from '../registerScreens';

// Mock the providers
jest.mock('../../providers/DeviceInfoProvider', () => ({
  DeviceInfoProvider: ({ children }: { children: React.ReactNode }) => children,
  useDeviceInfo: jest.fn(() => ({ deviceInfo: { id: 'test-device-id' }, loading: false })),
}));

jest.mock('../../providers/ActiveRoundsProvider', () => ({
  ActiveRoundsProvider: ({ children }: { children: React.ReactNode }) => children,
  useActiveRounds: jest.fn(() => ({
    rounds: [],
    progressSummaries: new Map(),
    loading: false,
    error: null,
    refresh: jest.fn(),
  })),
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
  useSafeAreaInsets: jest.fn(() => ({ top: 0, bottom: 0, left: 0, right: 0 })),
}));

// Mock navigation hook
jest.mock('../useAppNavigation', () => ({
  useAppNavigation: jest.fn(() => ({
    push: jest.fn(),
    pop: jest.fn(),
    goBack: jest.fn(),
    popToRoot: jest.fn(),
  })),
}));

// Mock screens
jest.mock('../../screens/ActiveRoundsScreen', () => ({
  ActiveRoundsScreen: () => null,
}));

jest.mock('../../screens/SettingsScreen', () => ({
  SettingsScreen: () => null,
}));

jest.mock('../../screens/RoundDetailScreen', () => ({
  RoundDetailScreen: () => null,
}));

jest.mock('../../screens/wizard/PeriodStepScreen', () => ({
  PeriodStepScreen: () => null,
}));

jest.mock('../../screens/wizard/GoalsStepScreen', () => ({
  GoalsStepScreen: () => null,
}));

jest.mock('../../screens/wizard/RewardPunishmentStepScreen', () => ({
  RewardPunishmentStepScreen: () => null,
}));

jest.mock('../../screens/wizard/SummaryStepScreen', () => ({
  SummaryStepScreen: () => null,
}));

describe('registerScreens', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Navigation.registerComponent = jest.fn();
  });

  test('registers all screens with React Native Navigation', () => {
    registerScreens();

    const registerCalls = (Navigation.registerComponent as jest.Mock).mock.calls;
    const expectedScreens = [
      'Main',
      'RoundDetail',
      'Settings',
      'PeriodStep',
      'GoalsStep',
      'RewardPunishmentStep',
      'SummaryStep',
    ];

    expect(registerCalls.length).toBe(expectedScreens.length);

    expectedScreens.forEach(screenName => {
      const call = registerCalls.find(regCall => regCall[0] === screenName);
      expect(call).toBeDefined();
      expect(call[1]).toBeInstanceOf(Function);
    });
  });

  test('wraps screens with providers', () => {
    registerScreens();

    const registerCalls = (Navigation.registerComponent as jest.Mock).mock.calls;
    const mainScreenWrapper = registerCalls.find(regCall => regCall[0] === 'Main')?.[1];
    expect(mainScreenWrapper).toBeDefined();

    // Render the wrapped component - should not throw
    const TestScreen = mainScreenWrapper();
    expect(() => {
      render(<TestScreen componentId="test-component-1" />);
    }).not.toThrow();
  });
});
