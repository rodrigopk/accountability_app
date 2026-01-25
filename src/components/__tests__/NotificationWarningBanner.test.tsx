import { render, fireEvent } from '@testing-library/react-native';
import React from 'react';

import { createNotificationProvider } from '../../services/notifications';
import { NotificationWarningBanner } from '../NotificationWarningBanner';

jest.mock('../../services/notifications', () => ({
  createNotificationProvider: jest.fn(),
}));

describe('NotificationWarningBanner', () => {
  it('should render warning message', () => {
    const { getByText } = render(<NotificationWarningBanner />);

    expect(getByText('Notifications Disabled')).toBeTruthy();
    expect(
      getByText('Enable notifications to receive goal reminders. Tap to open settings.'),
    ).toBeTruthy();
  });

  it('should call onPress when provided', () => {
    const onPress = jest.fn();
    const { getByText } = render(<NotificationWarningBanner onPress={onPress} />);

    fireEvent.press(getByText('Notifications Disabled'));

    expect(onPress).toHaveBeenCalled();
  });

  it('should open settings when no onPress provided', async () => {
    const mockOpenSettings = jest.fn();
    const mockProvider = {
      openSettings: mockOpenSettings,
    };

    (createNotificationProvider as jest.Mock).mockReturnValue(mockProvider);

    const { getByText } = render(<NotificationWarningBanner />);

    fireEvent.press(getByText('Notifications Disabled'));

    expect(createNotificationProvider).toHaveBeenCalled();
    expect(mockOpenSettings).toHaveBeenCalled();
  });
});
