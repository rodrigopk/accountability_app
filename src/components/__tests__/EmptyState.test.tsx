import { render, screen, fireEvent } from '@testing-library/react-native';

import { EmptyState } from '../EmptyState';

describe('EmptyState', () => {
  it('displays empty state message', () => {
    render(<EmptyState onCreatePress={jest.fn()} />);

    expect(screen.getByText(/No active accountability rounds/i)).toBeTruthy();
  });

  it('displays prompt to create a round', () => {
    render(<EmptyState onCreatePress={jest.fn()} />);

    expect(screen.getByText(/Create your first round/i)).toBeTruthy();
  });

  it('displays create button', () => {
    render(<EmptyState onCreatePress={jest.fn()} />);

    expect(screen.getByText(/Create Round/i)).toBeTruthy();
  });

  it('calls onCreatePress when button is pressed', () => {
    const onCreatePress = jest.fn();
    render(<EmptyState onCreatePress={onCreatePress} />);

    fireEvent.press(screen.getByText(/Create Round/i));

    expect(onCreatePress).toHaveBeenCalledTimes(1);
  });
});
