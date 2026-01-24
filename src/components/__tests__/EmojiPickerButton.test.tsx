import { render, screen, fireEvent } from '@testing-library/react-native';

import { EmojiPickerButton } from '../EmojiPickerButton';

jest.mock('rn-emoji-keyboard');

describe('EmojiPickerButton', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays placeholder when no value is set', () => {
    render(<EmojiPickerButton onChange={mockOnChange} />);
    expect(screen.getByText('➕')).toBeTruthy();
  });

  it('displays custom placeholder when provided', () => {
    render(<EmojiPickerButton onChange={mockOnChange} placeholder="🔮" />);
    expect(screen.getByText('🔮')).toBeTruthy();
  });

  it('displays selected emoji when value is set', () => {
    render(<EmojiPickerButton value="🏃" onChange={mockOnChange} />);
    expect(screen.getByText('🏃')).toBeTruthy();
  });

  it('opens emoji picker when pressed', () => {
    render(<EmojiPickerButton onChange={mockOnChange} />);

    expect(screen.queryByTestId('emoji-picker-modal')).toBeNull();

    fireEvent.press(screen.getByTestId('emoji-picker-button'));

    expect(screen.getByTestId('emoji-picker-modal')).toBeTruthy();
  });

  it('calls onChange when emoji is selected', () => {
    render(<EmojiPickerButton onChange={mockOnChange} />);

    fireEvent.press(screen.getByTestId('emoji-picker-button'));
    fireEvent.press(screen.getByTestId('emoji-option'));

    expect(mockOnChange).toHaveBeenCalledWith('🎯');
  });
});
