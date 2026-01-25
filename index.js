/**
 * @format
 */

// Must be imported at the very top before any other imports
// Required for uuid to work in React Native (provides crypto.getRandomValues polyfill)
import 'react-native-get-random-values';

import { Navigation } from 'react-native-navigation';

import { registerScreens, setDefaultOptions, setRoot } from './src/navigation/registerScreens';
import { rnnNavigationService, setCurrentComponentId } from './src/navigation/RNNNavigationService';
import { setNavigationService } from './src/navigation/useAppNavigation';

// Set RNN as the navigation service
setNavigationService(rnnNavigationService, true);

// Register all screens
try {
  registerScreens();
} catch (error) {
  console.error('Failed to register screens:', error);
  throw error;
}

// Set default options for all screens
setDefaultOptions();

// Launch app when ready - must use registerAppLaunchedListener for RNN v7
Navigation.events().registerAppLaunchedListener(() => {
  // Register global listener BEFORE setRoot to catch initial appear event
  Navigation.events().registerComponentDidAppearListener(({ componentId }) => {
    setCurrentComponentId(componentId);
  });

  try {
    setRoot();
  } catch (error) {
    console.error('Failed to set root:', error);
    throw error;
  }
});
