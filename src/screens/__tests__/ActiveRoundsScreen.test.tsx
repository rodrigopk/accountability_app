import { render, screen } from '@testing-library/react-native';

import { useActiveRounds } from '../../providers/ActiveRoundsProvider';
import { ActiveRoundsScreen } from '../ActiveRoundsScreen';

// Mock the provider hook
jest.mock('../../providers/ActiveRoundsProvider', () => ({
  useActiveRounds: jest.fn(),
}));

// Mock the navigation abstraction layer
jest.mock('../../navigation/useAppNavigation', () => ({
  useAppNavigation: () => ({
    openCreateWizard: jest.fn(),
    goToRoundDetail: jest.fn(),
  }),
  useOnScreenFocus: jest.fn(),
}));

// Mock react-native-safe-area-context (shared mock)
jest.mock('react-native-safe-area-context');

describe('ActiveRoundsScreen', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading indicator when loading', () => {
    (useActiveRounds as jest.Mock).mockReturnValue({
      rounds: [],
      progressSummaries: new Map(),
      loading: true,
      error: null,
      refresh: jest.fn(),
    });

    render(<ActiveRoundsScreen />);

    expect(screen.getByTestId('loading-indicator')).toBeTruthy();
  });

  it('shows empty state when no rounds exist', () => {
    (useActiveRounds as jest.Mock).mockReturnValue({
      rounds: [],
      progressSummaries: new Map(),
      loading: false,
      error: null,
      refresh: jest.fn(),
    });

    render(<ActiveRoundsScreen />);

    expect(screen.getByText(/No active accountability rounds/i)).toBeTruthy();
  });

  it('shows error message when fetch fails', () => {
    (useActiveRounds as jest.Mock).mockReturnValue({
      rounds: [],
      progressSummaries: new Map(),
      loading: false,
      error: new Error('Network error'),
      refresh: jest.fn(),
    });

    render(<ActiveRoundsScreen />);

    expect(screen.getByText(/Network error/i)).toBeTruthy();
  });

  it('displays app name', async () => {
    (useActiveRounds as jest.Mock).mockReturnValue({
      rounds: [
        {
          id: 'round-1',
          deviceId: 'device-123',
          startDate: '2026-01-01',
          endDate: '2026-01-31',
          goals: [],
          reward: 'Test Reward',
          punishment: '',
          createdAt: '2026-01-01T00:00:00Z',
          updatedAt: '2026-01-01T00:00:00Z',
        },
      ],
      progressSummaries: new Map(),
      loading: false,
      error: null,
      refresh: jest.fn(),
    });

    render(<ActiveRoundsScreen />);

    expect(await screen.findByText('Commit')).toBeTruthy();
  });

  it('displays screen title', async () => {
    (useActiveRounds as jest.Mock).mockReturnValue({
      rounds: [
        {
          id: 'round-1',
          deviceId: 'device-123',
          startDate: '2026-01-01',
          endDate: '2026-01-31',
          goals: [],
          reward: 'Test Reward',
          punishment: '',
          createdAt: '2026-01-01T00:00:00Z',
          updatedAt: '2026-01-01T00:00:00Z',
        },
      ],
      progressSummaries: new Map(),
      loading: false,
      error: null,
      refresh: jest.fn(),
    });

    render(<ActiveRoundsScreen />);

    expect(await screen.findByText('Active Rounds')).toBeTruthy();
  });

  it('displays screen subtitle', async () => {
    (useActiveRounds as jest.Mock).mockReturnValue({
      rounds: [
        {
          id: 'round-1',
          deviceId: 'device-123',
          startDate: '2026-01-01',
          endDate: '2026-01-31',
          goals: [],
          reward: 'Test Reward',
          punishment: '',
          createdAt: '2026-01-01T00:00:00Z',
          updatedAt: '2026-01-01T00:00:00Z',
        },
      ],
      progressSummaries: new Map(),
      loading: false,
      error: null,
      refresh: jest.fn(),
    });

    render(<ActiveRoundsScreen />);

    expect(await screen.findByText(/Track your progress and stay accountable/i)).toBeTruthy();
  });
});
