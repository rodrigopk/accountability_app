import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';

import { ClearAllDataService } from '../../services/data/ClearAllDataService';
import { SettingsScreen } from '../SettingsScreen';

jest.spyOn(Alert, 'alert');

jest.mock('react-native-device-info', () => ({
  getVersion: () => '1.0.0',
  getBuildNumber: () => '2405',
}));

// Mock react-native-safe-area-context (shared mock)
jest.mock('react-native-safe-area-context');

jest.mock('../../services/data/ClearAllDataService');
jest.mock('../../providers/ActiveRoundsProvider', () => ({
  useActiveRounds: () => ({ refresh: jest.fn().mockResolvedValue(undefined) }),
}));

// Mock the notifications module - Jest will automatically use __mocks__/index.ts
jest.mock('../../services/notifications');

describe('SettingsScreen', () => {
  // Suppress React act warnings for async state updates in useEffect
  // These are expected when testing components with async effects
  const originalError = console.error;
  beforeAll(() => {
    console.error = (...args: unknown[]) => {
      if (
        typeof args[0] === 'string' &&
        args[0].includes('An update to SettingsScreen inside a test was not wrapped in act')
      ) {
        return;
      }
      originalError.call(console, ...args);
    };
  });

  afterAll(() => {
    console.error = originalError;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays Settings title', async () => {
    render(<SettingsScreen />);
    await waitFor(() => {
      expect(screen.getByText('Settings')).toBeTruthy();
    });
  });

  it('displays app version', async () => {
    render(<SettingsScreen />);
    await waitFor(() => {
      expect(screen.getByText('App Version')).toBeTruthy();
      expect(screen.getByText('1.0.0')).toBeTruthy();
    });
  });

  it('displays build number', async () => {
    render(<SettingsScreen />);
    await waitFor(() => {
      expect(screen.getByText('Build Number')).toBeTruthy();
      expect(screen.getByText('2405')).toBeTruthy();
    });
  });

  it('displays Delete All Data button', async () => {
    render(<SettingsScreen />);
    await waitFor(() => {
      expect(screen.getByText('Delete All Data')).toBeTruthy();
    });
  });

  it('shows confirmation alert when Delete All Data is pressed', async () => {
    render(<SettingsScreen />);

    await waitFor(() => {
      expect(screen.getByTestId('delete-all-data-button')).toBeTruthy();
    });

    fireEvent.press(screen.getByTestId('delete-all-data-button'));

    expect(Alert.alert).toHaveBeenCalledWith(
      'Delete All Data',
      expect.stringContaining('permanently remove'),
      expect.arrayContaining([
        expect.objectContaining({ text: 'Cancel' }),
        expect.objectContaining({ text: 'Delete', style: 'destructive' }),
      ]),
    );
  });

  it('calls ClearAllDataService and shows success alert on confirm', async () => {
    const mockExecute = jest.fn().mockResolvedValue(undefined);
    (ClearAllDataService as jest.Mock).mockImplementation(() => ({
      execute: mockExecute,
    }));

    render(<SettingsScreen />);

    await waitFor(() => {
      expect(screen.getByTestId('delete-all-data-button')).toBeTruthy();
    });

    fireEvent.press(screen.getByTestId('delete-all-data-button'));

    // Get the Delete button callback from Alert.alert
    const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
    const deleteButton = alertCall[2].find((btn: { text: string }) => btn.text === 'Delete');

    await deleteButton.onPress();

    expect(mockExecute).toHaveBeenCalled();
    expect(Alert.alert).toHaveBeenLastCalledWith(
      'Data Deleted',
      'All local data has been removed successfully.',
    );
  });

  it('shows error alert when deletion fails', async () => {
    const mockExecute = jest.fn().mockRejectedValue(new Error('Failed'));
    (ClearAllDataService as jest.Mock).mockImplementation(() => ({
      execute: mockExecute,
    }));

    render(<SettingsScreen />);

    await waitFor(() => {
      expect(screen.getByTestId('delete-all-data-button')).toBeTruthy();
    });

    fireEvent.press(screen.getByTestId('delete-all-data-button'));

    const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
    const deleteButton = alertCall[2].find((btn: { text: string }) => btn.text === 'Delete');

    await deleteButton.onPress();

    expect(Alert.alert).toHaveBeenLastCalledWith(
      'Error',
      'Failed to delete data. Please try again.',
    );
  });
});
