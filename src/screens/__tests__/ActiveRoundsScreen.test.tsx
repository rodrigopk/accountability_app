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
});
