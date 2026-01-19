import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

import { GetProgressSummaryService } from '../services/progress/GetProgressSummaryService';
import { GetActiveRoundsService } from '../services/round/GetActiveRoundsService';
import { RoundProgressSummary } from '../services/types';
import { AccountabilityRound } from '../types/AccountabilityRound';

import { useDeviceInfo } from './DeviceInfoProvider';

interface ActiveRoundsContextValue {
  rounds: AccountabilityRound[];
  progressSummaries: Map<string, RoundProgressSummary>;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

const ActiveRoundsContext = createContext<ActiveRoundsContextValue | undefined>(undefined);

interface ActiveRoundsProviderProps {
  children: React.ReactNode;
}

/**
 * Provider component that manages active rounds state and progress summaries.
 * Loads active rounds on mount and provides them via context.
 */
export function ActiveRoundsProvider({ children }: ActiveRoundsProviderProps) {
  const { deviceInfo, loading: deviceInfoLoading } = useDeviceInfo();
  const [rounds, setRounds] = useState<AccountabilityRound[]>([]);
  const [progressSummaries, setProgressSummaries] = useState<Map<string, RoundProgressSummary>>(
    new Map(),
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadActiveRounds = useCallback(async () => {
    if (!deviceInfo?.id || deviceInfoLoading) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const getActiveRoundsService = new GetActiveRoundsService();
      const activeRounds = await getActiveRoundsService.execute(deviceInfo.id);

      setRounds(activeRounds);

      // Fetch progress summaries for each round
      const getProgressSummaryService = new GetProgressSummaryService();
      const summariesMap = new Map<string, RoundProgressSummary>();

      await Promise.all(
        activeRounds.map(async round => {
          try {
            const summary = await getProgressSummaryService.execute(round.id);
            summariesMap.set(round.id, summary);
          } catch (err) {
            // If progress summary fails for a round, continue with others
            console.error(`Failed to load progress for round ${round.id}:`, err);
          }
        }),
      );

      setProgressSummaries(summariesMap);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load active rounds'));
    } finally {
      setLoading(false);
    }
  }, [deviceInfo?.id, deviceInfoLoading]);

  useEffect(() => {
    loadActiveRounds();
  }, [loadActiveRounds]);

  const refresh = useCallback(async () => {
    await loadActiveRounds();
  }, [loadActiveRounds]);

  return (
    <ActiveRoundsContext.Provider value={{ rounds, progressSummaries, loading, error, refresh }}>
      {children}
    </ActiveRoundsContext.Provider>
  );
}

/**
 * Hook to access active rounds from context
 * @returns ActiveRounds context value
 * @throws Error if used outside ActiveRoundsProvider
 */
export function useActiveRounds(): ActiveRoundsContextValue {
  const context = useContext(ActiveRoundsContext);
  if (context === undefined) {
    throw new Error('useActiveRounds must be used within an ActiveRoundsProvider');
  }
  return context;
}
