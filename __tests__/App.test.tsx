/**
 * @format
 */

import { Navigation } from 'react-native-navigation';

import { registerScreens, setDefaultOptions, setRoot } from '../src/navigation/registerScreens';

// Mock react-native-navigation
jest.mock('react-native-navigation', () => ({
  Navigation: {
    registerComponent: jest.fn(),
    setDefaultOptions: jest.fn(),
    setRoot: jest.fn(),
    events: jest.fn(() => ({
      registerAppLaunchedListener: jest.fn(callback => callback()),
      registerComponentDidAppearListener: jest.fn(() => ({ remove: jest.fn() })),
    })),
    push: jest.fn(),
    pop: jest.fn(),
    showModal: jest.fn(),
    dismissModal: jest.fn(),
    dismissAllModals: jest.fn(),
    popToRoot: jest.fn(),
  },
}));

// Mock the providers
jest.mock('../src/providers/DeviceInfoProvider', () => ({
  DeviceInfoProvider: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('../src/providers/ActiveRoundsProvider', () => ({
  ActiveRoundsProvider: ({ children }: { children: React.ReactNode }) => children,
}));

describe('App initialization', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('registers all screens', () => {
    registerScreens();

    expect(Navigation.registerComponent).toHaveBeenCalledWith('Main', expect.any(Function));
    expect(Navigation.registerComponent).toHaveBeenCalledWith('RoundDetail', expect.any(Function));
    expect(Navigation.registerComponent).toHaveBeenCalledWith('PeriodStep', expect.any(Function));
    expect(Navigation.registerComponent).toHaveBeenCalledWith('GoalsStep', expect.any(Function));
    expect(Navigation.registerComponent).toHaveBeenCalledWith(
      'RewardPunishmentStep',
      expect.any(Function),
    );
    expect(Navigation.registerComponent).toHaveBeenCalledWith('SummaryStep', expect.any(Function));
  });

  test('sets default options', () => {
    setDefaultOptions();

    expect(Navigation.setDefaultOptions).toHaveBeenCalledWith(
      expect.objectContaining({
        topBar: { visible: false },
      }),
    );
  });

  test('sets root on launch', () => {
    setRoot();

    expect(Navigation.setRoot).toHaveBeenCalledWith(
      expect.objectContaining({
        root: expect.objectContaining({
          bottomTabs: expect.objectContaining({
            id: 'MainTabs',
            children: expect.arrayContaining([
              expect.objectContaining({
                stack: expect.objectContaining({
                  id: 'RoundsStack',
                  children: expect.arrayContaining([
                    expect.objectContaining({
                      component: expect.objectContaining({
                        name: 'Main',
                      }),
                    }),
                  ]),
                }),
              }),
              expect.objectContaining({
                stack: expect.objectContaining({
                  id: 'SettingsStack',
                  children: expect.arrayContaining([
                    expect.objectContaining({
                      component: expect.objectContaining({
                        name: 'Settings',
                      }),
                    }),
                  ]),
                }),
              }),
            ]),
          }),
        }),
      }),
    );
  });
});
