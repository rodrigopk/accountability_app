/**
 * Navigation service interface - screens depend on this abstraction, not the library.
 * This allows swapping navigation libraries without changing screen code.
 */

export type ScreenName =
  | 'Main'
  | 'RoundDetail'
  | 'CreateRoundWizard'
  | 'PeriodStep'
  | 'GoalsStep'
  | 'RewardPunishmentStep'
  | 'SummaryStep';

export interface RoundDetailParams {
  roundId: string;
}

export interface NavigationService {
  // Stack navigation
  push(screen: ScreenName, params?: Record<string, unknown>): void;
  pop(): void;
  popToRoot(): void;

  // Modal navigation
  showModal(screen: ScreenName, params?: Record<string, unknown>): void;
  dismissModal(): void;

  // Events
  onScreenFocus(callback: () => void): () => void;
}
