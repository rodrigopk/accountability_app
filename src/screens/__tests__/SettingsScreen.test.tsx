import { render, screen, fireEvent } from '@testing-library/react-native';
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

describe('SettingsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays Settings title', () => {
    render(<SettingsScreen />);
    expect(screen.getByText('Settings')).toBeTruthy();
  });

  it('displays app version', () => {
    render(<SettingsScreen />);
    expect(screen.getByText('App Version')).toBeTruthy();
    expect(screen.getByText('1.0.0')).toBeTruthy();
  });

  it('displays build number', () => {
    render(<SettingsScreen />);
    expect(screen.getByText('Build Number')).toBeTruthy();
    expect(screen.getByText('2405')).toBeTruthy();
  });

  it('displays Delete All Data button', () => {
    render(<SettingsScreen />);
    expect(screen.getByText('Delete All Data')).toBeTruthy();
  });

  it('shows confirmation alert when Delete All Data is pressed', () => {
    render(<SettingsScreen />);

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
