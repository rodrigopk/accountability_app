/**
 * Screen registration for React Native Navigation.
 * Each screen is wrapped with providers and componentId tracking.
 */
import React, { useEffect } from 'react';
import { Navigation } from 'react-native-navigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ActiveRoundsProvider } from '../providers/ActiveRoundsProvider';
import { DeviceInfoProvider } from '../providers/DeviceInfoProvider';
import { ActiveRoundsScreen } from '../screens/ActiveRoundsScreen';
import { RoundDetailScreen } from '../screens/RoundDetailScreen';
import { GoalsStepScreen } from '../screens/wizard/GoalsStepScreen';
import { PeriodStepScreen } from '../screens/wizard/PeriodStepScreen';
import { RewardPunishmentStepScreen } from '../screens/wizard/RewardPunishmentStepScreen';
import { SummaryStepScreen } from '../screens/wizard/SummaryStepScreen';

import { setCurrentComponentId } from './RNNNavigationService';

interface RNNScreenProps {
  componentId: string;
  [key: string]: unknown;
}

/**
 * HOC to wrap screens with providers and track componentId.
 */
function withProviders<P extends object>(
  Screen: React.ComponentType<P>,
  screenName: string,
): React.ComponentType<RNNScreenProps & P> {
  function WrappedScreen(props: RNNScreenProps & P) {
    const { componentId, ...screenProps } = props;

    useEffect(() => {
      // Update current componentId when screen appears
      setCurrentComponentId(componentId);

      // Also listen for when this screen appears (in case of back navigation)
      const subscription = Navigation.events().registerComponentDidAppearListener(event => {
        if (event.componentId === componentId) {
          setCurrentComponentId(componentId);
        }
      });

      return () => {
        subscription.remove();
      };
    }, [componentId]);

    return (
      <SafeAreaProvider>
        <DeviceInfoProvider>
          <ActiveRoundsProvider>
            <Screen {...(screenProps as P)} />
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
      stack: {
        children: [
          {
            component: {
              name: 'Main',
              options: {
                topBar: { visible: false },
              },
            },
          },
        ],
      },
    },
  });
}
