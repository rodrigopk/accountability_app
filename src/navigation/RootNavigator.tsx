import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { ActiveRoundsScreen } from '../screens/ActiveRoundsScreen';
import { RoundDetailScreen } from '../screens/RoundDetailScreen';

import { CreateRoundNavigator } from './CreateRoundNavigator';
import { RootStackParamList } from './types';

const Stack = createStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={ActiveRoundsScreen} />
      <Stack.Screen
        name="CreateRoundWizard"
        component={CreateRoundNavigator}
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen
        name="RoundDetail"
        component={RoundDetailScreen}
        options={{ headerShown: true, title: 'Round Details' }}
      />
    </Stack.Navigator>
  );
}
