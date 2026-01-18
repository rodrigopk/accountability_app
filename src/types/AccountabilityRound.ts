import { Goal } from './Goal';

export interface AccountabilityRound {
  id: string;
  deviceId: string;
  startDate: string;
  endDate: string;
  goals: Goal[];
  reward: string;
  punishment: string;
  createdAt: string;
  updatedAt: string;
}
