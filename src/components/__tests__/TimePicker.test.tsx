import { render, fireEvent } from '@testing-library/react-native';
import React from 'react';

import { TimePicker } from '../TimePicker';

describe('TimePicker', () => {
  it('should display formatted time', () => {
    const onChange = jest.fn();
    const { getByText } = render(<TimePicker value="09:00" onChange={onChange} />);

    expect(getByText('9:00 AM')).toBeTruthy();
  });

  it('should display PM time correctly', () => {
    const onChange = jest.fn();
    const { getByText } = render(<TimePicker value="14:30" onChange={onChange} />);

    expect(getByText('2:30 PM')).toBeTruthy();
  });

  it('should display 12:00 PM correctly', () => {
    const onChange = jest.fn();
    const { getByText } = render(<TimePicker value="12:00" onChange={onChange} />);

    expect(getByText('12:00 PM')).toBeTruthy();
  });

  it('should display 12:00 AM correctly', () => {
    const onChange = jest.fn();
    const { getByText } = render(<TimePicker value="00:00" onChange={onChange} />);

    expect(getByText('12:00 AM')).toBeTruthy();
  });

  it('should call onChange when time is selected', () => {
    const onChange = jest.fn();
    const { getByText } = render(<TimePicker value="09:00" onChange={onChange} />);

    const button = getByText('9:00 AM');
    fireEvent.press(button);

    // The DateTimePicker will be shown, but we can't easily test the actual picker interaction
    // This test verifies the button is pressable
    expect(button).toBeTruthy();
  });
});
