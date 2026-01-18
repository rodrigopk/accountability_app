import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

import { Goal } from '../types/Goal';
import { generateUUID } from '../utils/uuidUtils';

const WIZARD_DRAFT_KEY = '@wizard_draft';

interface WizardState {
  period: {
    startDate: Date | null;
    endDate: Date | null;
  };
  goals: Goal[];
  reward: string;
  punishment: string;
}

interface WizardContextValue {
  state: WizardState;
  updatePeriod: (startDate: Date, endDate: Date) => void;
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  updateGoal: (goalId: string, updates: Partial<Omit<Goal, 'id'>>) => void;
  removeGoal: (goalId: string) => void;
  updateRewardPunishment: (reward: string, punishment: string) => void;
  reset: () => void;
  isStepValid: (step: 'period' | 'goals' | 'reward') => boolean;
}

const initialState: WizardState = {
  period: { startDate: null, endDate: null },
  goals: [],
  reward: '',
  punishment: '',
};

const WizardContext = createContext<WizardContextValue | undefined>(undefined);

export function CreateRoundWizardProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<WizardState>(initialState);

  // Load draft from storage on mount
  useEffect(() => {
    loadDraft();
  }, []);

  // Save draft to storage whenever state changes
  useEffect(() => {
    saveDraft(state);
  }, [state]);

  const loadDraft = async () => {
    try {
      const draft = await AsyncStorage.getItem(WIZARD_DRAFT_KEY);
      if (draft) {
        const parsed = JSON.parse(draft);
        // Convert ISO strings back to Date objects
        if (parsed.period.startDate) {
          parsed.period.startDate = new Date(parsed.period.startDate);
        }
        if (parsed.period.endDate) {
          parsed.period.endDate = new Date(parsed.period.endDate);
        }
        setState(parsed);
      }
    } catch (error) {
      console.error('Failed to load wizard draft:', error);
    }
  };

  const saveDraft = async (currentState: WizardState) => {
    try {
      await AsyncStorage.setItem(WIZARD_DRAFT_KEY, JSON.stringify(currentState));
    } catch (error) {
      console.error('Failed to save wizard draft:', error);
    }
  };

  const updatePeriod = useCallback((startDate: Date, endDate: Date) => {
    setState(prev => ({
      ...prev,
      period: { startDate, endDate },
    }));
  }, []);

  const addGoal = useCallback((goal: Omit<Goal, 'id'>) => {
    const newGoal: Goal = {
      ...goal,
      id: generateUUID(),
    };
    setState(prev => ({
      ...prev,
      goals: [...prev.goals, newGoal],
    }));
  }, []);

  const updateGoal = useCallback((goalId: string, updates: Partial<Omit<Goal, 'id'>>) => {
    setState(prev => ({
      ...prev,
      goals: prev.goals.map(goal => (goal.id === goalId ? { ...goal, ...updates } : goal)),
    }));
  }, []);

  const removeGoal = useCallback((goalId: string) => {
    setState(prev => ({
      ...prev,
      goals: prev.goals.filter(goal => goal.id !== goalId),
    }));
  }, []);

  const updateRewardPunishment = useCallback((reward: string, punishment: string) => {
    setState(prev => ({
      ...prev,
      reward,
      punishment,
    }));
  }, []);

  const reset = useCallback(async () => {
    setState(initialState);
    try {
      await AsyncStorage.removeItem(WIZARD_DRAFT_KEY);
    } catch (error) {
      console.error('Failed to clear wizard draft:', error);
    }
  }, []);

  const isStepValid = useCallback(
    (step: 'period' | 'goals' | 'reward'): boolean => {
      switch (step) {
        case 'period':
          return !!(
            state.period.startDate &&
            state.period.endDate &&
            state.period.endDate > state.period.startDate
          );
        case 'goals':
          return state.goals.length > 0;
        case 'reward':
          return state.reward.trim().length > 0 && state.punishment.trim().length > 0;
        default:
          return false;
      }
    },
    [state],
  );

  return (
    <WizardContext.Provider
      value={{
        state,
        updatePeriod,
        addGoal,
        updateGoal,
        removeGoal,
        updateRewardPunishment,
        reset,
        isStepValid,
      }}
    >
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard(): WizardContextValue {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error('useWizard must be used within CreateRoundWizardProvider');
  }
  return context;
}
