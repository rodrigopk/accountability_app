import { NavigationContainer } from '@react-navigation/native';
import React from 'react';

import { navigationRef } from './src/navigation/ReactNavigationService';
import { RootNavigator } from './src/navigation/RootNavigator';
import { ActiveRoundsProvider } from './src/providers/ActiveRoundsProvider';
import { DeviceInfoProvider } from './src/providers/DeviceInfoProvider';

function App() {
  return (
    <NavigationContainer ref={navigationRef}>
      <DeviceInfoProvider>
        <ActiveRoundsProvider>
          <RootNavigator />
        </ActiveRoundsProvider>
      </DeviceInfoProvider>
    </NavigationContainer>
  );
}

export default App;
