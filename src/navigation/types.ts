/**
 * Navigation types for React Native Navigation.
 * These are used for type-checking screen props and navigation.
 */

// Root stack screen names
export type RootStackParamList = {
  Main: undefined;
  RoundDetail: { roundId: string };
  PeriodStep: undefined;
  GoalsStep: undefined;
  RewardPunishmentStep: undefined;
  SummaryStep: undefined;
};

// Props passed to screens via RNN passProps
export interface RoundDetailProps {
  roundId: string;
}

// Component ID prop that RNN passes to every screen
export interface RNNScreenProps {
  componentId: string;
}
