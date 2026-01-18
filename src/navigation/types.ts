import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Root stack with Main and CreateRound stacks
export type RootStackParamList = {
  Main: undefined;
  CreateRoundWizard: undefined;
  RoundDetail: { roundId: string };
};

// CreateRound wizard stack
export type CreateRoundStackParamList = {
  PeriodStep: undefined;
  GoalsStep: undefined;
  RewardPunishmentStep: undefined;
  SummaryStep: undefined;
};

// Navigation prop types for each wizard screen
export type PeriodStepNavigationProp = StackNavigationProp<CreateRoundStackParamList, 'PeriodStep'>;

export type GoalsStepNavigationProp = StackNavigationProp<CreateRoundStackParamList, 'GoalsStep'>;

export type RewardPunishmentStepNavigationProp = StackNavigationProp<
  CreateRoundStackParamList,
  'RewardPunishmentStep'
>;

export type SummaryStepNavigationProp = StackNavigationProp<
  CreateRoundStackParamList,
  'SummaryStep'
>;

// Navigation prop types for RoundDetail screen
export type RoundDetailNavigationProp = StackNavigationProp<RootStackParamList, 'RoundDetail'>;
export type RoundDetailRouteProp = RouteProp<RootStackParamList, 'RoundDetail'>;
