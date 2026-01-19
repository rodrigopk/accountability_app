/**
 * Zustand store for wizard state management.
 * Replaces CreateRoundWizardProvider with a global store that works across
 * independently registered screens (required for react-native-navigation).
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { Goal } from '../types/Goal';
import { generateUUID } from '../utils/uuidUtils';

interface WizardState {
  // State
  period: {
    startDate: Date | null;
    endDate: Date | null;
  };
  goals: Goal[];
  reward: string;
  punishment: string;

  // Actions
  updatePeriod: (startDate: Date, endDate: Date) => void;
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  updateGoal: (goalId: string, updates: Partial<Omit<Goal, 'id'>>) => void;
  removeGoal: (goalId: string) => void;
  updateRewardPunishment: (reward: string, punishment: string) => void;
  reset: () => Promise<void>;

  // Computed
  isStepValid: (step: 'period' | 'goals' | 'reward') => boolean;
}

const initialState = {
  period: { startDate: null as Date | null, endDate: null as Date | null },
  goals: [] as Goal[],
  reward: '',
  punishment: '',
};

export const useWizardStore = create<WizardState>()(
  persist(
    (set, get) => ({
      ...initialState,

      updatePeriod: (startDate: Date, endDate: Date) => set({ period: { startDate, endDate } }),

      addGoal: (goal: Omit<Goal, 'id'>) =>
        set(state => ({
          goals: [...state.goals, { ...goal, id: generateUUID() }],
        })),

      updateGoal: (goalId: string, updates: Partial<Omit<Goal, 'id'>>) =>
        set(state => ({
          goals: state.goals.map(g => (g.id === goalId ? { ...g, ...updates } : g)),
        })),

      removeGoal: (goalId: string) =>
        set(state => ({
          goals: state.goals.filter(g => g.id !== goalId),
        })),

      updateRewardPunishment: (reward: string, punishment: string) => set({ reward, punishment }),

      reset: async () => {
        set(initialState);
        // Clear persisted data
        try {
          await AsyncStorage.removeItem('@wizard_draft');
        } catch (error) {
          console.error('Failed to clear wizard draft:', error);
        }
      },

      isStepValid: (step: 'period' | 'goals' | 'reward') => {
        const state = get();
        switch (step) {
          case 'period':
            return !!(
              state.period.startDate &&
              state.period.endDate &&
              state.period.endDate > state.period.startDate
            );
          case 'goals':
            return state.goals.length > 0 && state.goals.every(g => g.title.trim().length > 0);
          case 'reward':
            return state.reward.trim().length > 0 && state.punishment.trim().length > 0;
          default:
            return false;
        }
      },
    }),
    {
      name: '@wizard_draft',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist the state, not the actions
      partialize: state => ({
        period: state.period,
        goals: state.goals,
        reward: state.reward,
        punishment: state.punishment,
      }),
      // Handle date deserialization
      onRehydrateStorage: () => state => {
        if (state) {
          // Convert ISO strings back to Date objects after rehydration
          if (state.period.startDate && typeof state.period.startDate === 'string') {
            state.period.startDate = new Date(state.period.startDate);
          }
          if (state.period.endDate && typeof state.period.endDate === 'string') {
            state.period.endDate = new Date(state.period.endDate);
          }
        }
      },
    },
  ),
);
