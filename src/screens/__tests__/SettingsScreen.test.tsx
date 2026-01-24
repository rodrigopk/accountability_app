import { render, screen, fireEvent } from '@testing-library/react-native';
import { Alert } from 'react-native';

import { SettingsScreen } from '../SettingsScreen';

jest.spyOn(Alert, 'alert');

jest.mock('react-native-device-info', () => ({
  getVersion: () => '1.0.0',
  getBuildNumber: () => '2405',
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
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
});
