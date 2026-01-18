/**
 * @format
 */

// Must be imported at the very top before any other imports
// Required for uuid to work in React Native (provides crypto.getRandomValues polyfill)
import 'react-native-get-random-values';
// Required for @react-navigation/stack on Android
import 'react-native-gesture-handler';

import { AppRegistry } from 'react-native';

import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
