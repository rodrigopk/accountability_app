import React from 'react';

import { DeviceInfoProvider } from './src/providers/DeviceInfoProvider';
import { ActiveRoundsProvider } from './src/providers/ActiveRoundsProvider';
import { ActiveRoundsScreen } from './src/screens/ActiveRoundsScreen';

function App() {
  return (
    <DeviceInfoProvider>
      <ActiveRoundsProvider>
        <ActiveRoundsScreen />
      </ActiveRoundsProvider>
    </DeviceInfoProvider>
  );
}


export default App;
