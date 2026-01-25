/**
 * Screen registration for React Native Navigation.
 * Each screen is wrapped with providers.
 */
import React from 'react';
import { Navigation } from 'react-native-navigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ActiveRoundsProvider } from '../providers/ActiveRoundsProvider';
import { DeviceInfoProvider } from '../providers/DeviceInfoProvider';
import { ActiveRoundsScreen } from '../screens/ActiveRoundsScreen';
import { RoundDetailScreen } from '../screens/RoundDetailScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { GoalsStepScreen } from '../screens/wizard/GoalsStepScreen';
import { PeriodStepScreen } from '../screens/wizard/PeriodStepScreen';
import { RewardPunishmentStepScreen } from '../screens/wizard/RewardPunishmentStepScreen';
import { SummaryStepScreen } from '../screens/wizard/SummaryStepScreen';
import { colors } from '../theme';

interface RNNScreenProps {
  componentId: string;
  [key: string]: unknown;
}

/**
 * HOC to wrap screens with providers.
 */
function withProviders<P extends object>(
  Screen: React.ComponentType<P>,
  screenName: string,
): React.ComponentType<RNNScreenProps & P> {
  function WrappedScreen(props: RNNScreenProps & P) {
    return (
      <SafeAreaProvider>
        <DeviceInfoProvider>
          <ActiveRoundsProvider>
            <Screen {...props} />
          </ActiveRoundsProvider>
        </DeviceInfoProvider>
      </SafeAreaProvider>
    );
  }

  WrappedScreen.displayName = `withProviders(${screenName})`;
  return WrappedScreen;
}

/**
 * Register all screens with React Native Navigation.
 * Must be called before Navigation.setRoot().
 */
export function registerScreens() {
  try {
    // Main screens
    Navigation.registerComponent('Main', () => withProviders(ActiveRoundsScreen, 'Main'));
    Navigation.registerComponent('RoundDetail', () =>
      withProviders(RoundDetailScreen as React.ComponentType<{ roundId: string }>, 'RoundDetail'),
    );
    Navigation.registerComponent('Settings', () => withProviders(SettingsScreen, 'Settings'));

    // Wizard screens
    Navigation.registerComponent('PeriodStep', () => withProviders(PeriodStepScreen, 'PeriodStep'));
    Navigation.registerComponent('GoalsStep', () => withProviders(GoalsStepScreen, 'GoalsStep'));
    Navigation.registerComponent('RewardPunishmentStep', () =>
      withProviders(RewardPunishmentStepScreen, 'RewardPunishmentStep'),
    );
    Navigation.registerComponent('SummaryStep', () =>
      withProviders(SummaryStepScreen, 'SummaryStep'),
    );
  } catch (error) {
    console.error('Error registering screens:', error);
    throw error;
  }
}

/**
 * Set default options for all screens.
 */
export function setDefaultOptions() {
  Navigation.setDefaultOptions({
    topBar: {
      visible: false,
    },
    statusBar: {
      style: 'dark',
    },
    layout: {
      backgroundColor: '#ffffff',
    },
  });
}

/**
 * Set the root of the app.
 */
export function setRoot() {
  Navigation.setRoot({
    root: {
      bottomTabs: {
        id: 'MainTabs',
        children: [
          {
            stack: {
              id: 'RoundsStack',
              children: [
                {
                  component: {
                    name: 'Main',
                    options: { topBar: { visible: false } },
                  },
                },
              ],
              options: {
                bottomTab: {
                  text: 'Rounds',
                  icon: require('../../assets/icons/rounds-outline.png'),
                  iconColor: colors.textTertiary,
                  selectedIconColor: colors.primary,
                  textColor: colors.textTertiary,
                  selectedTextColor: colors.primary,
                },
              },
            },
          },
          {
            stack: {
              id: 'SettingsStack',
              children: [
                {
                  component: {
                    name: 'Settings',
                    options: { topBar: { visible: false } },
                  },
                },
              ],
              options: {
                bottomTab: {
                  text: 'Settings',
                  icon: require('../../assets/icons/settings-outline.png'),
                  iconColor: colors.textTertiary,
                  selectedIconColor: colors.primary,
                  textColor: colors.textTertiary,
                  selectedTextColor: colors.primary,
                },
              },
            },
          },
        ],
        options: {
          bottomTabs: {
            backgroundColor: colors.surface,
            titleDisplayMode: 'alwaysShow',
          },
        },
      },
    },
  });
}
