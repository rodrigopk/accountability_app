import { NavigationContainer } from '@react-navigation/native';
import React from 'react';

import { RootNavigator } from './src/navigation/RootNavigator';
import { ActiveRoundsProvider } from './src/providers/ActiveRoundsProvider';
import { DeviceInfoProvider } from './src/providers/DeviceInfoProvider';

function App() {
  return (
    <NavigationContainer>
      <DeviceInfoProvider>
        <ActiveRoundsProvider>
          <RootNavigator />
        </ActiveRoundsProvider>
      </DeviceInfoProvider>
    </NavigationContainer>
  );
}

export default App;
