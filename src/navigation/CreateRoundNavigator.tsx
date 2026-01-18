import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { CreateRoundWizardProvider } from '../providers/CreateRoundWizardProvider';
import { GoalsStepScreen } from '../screens/wizard/GoalsStepScreen';
import { PeriodStepScreen } from '../screens/wizard/PeriodStepScreen';
import { RewardPunishmentStepScreen } from '../screens/wizard/RewardPunishmentStepScreen';
import { SummaryStepScreen } from '../screens/wizard/SummaryStepScreen';

import { CreateRoundStackParamList } from './types';

const Stack = createStackNavigator<CreateRoundStackParamList>();

export function CreateRoundNavigator() {
  return (
    <CreateRoundWizardProvider>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#fff' },
        }}
      >
        <Stack.Screen name="PeriodStep" component={PeriodStepScreen} />
        <Stack.Screen name="GoalsStep" component={GoalsStepScreen} />
        <Stack.Screen name="RewardPunishmentStep" component={RewardPunishmentStepScreen} />
        <Stack.Screen name="SummaryStep" component={SummaryStepScreen} />
      </Stack.Navigator>
    </CreateRoundWizardProvider>
  );
}
