/**
 * Shared mock for rn-emoji-keyboard
 * Used across multiple component tests
 */

interface MockEmojiPickerProps {
  open: boolean;
  onEmojiSelected: (emoji: { emoji: string }) => void;
  onClose: () => void;
}

const MockEmojiPicker = ({ open, onEmojiSelected, onClose }: MockEmojiPickerProps) => {
  const React = require('react');
  if (!open) return null;
  return React.createElement(
    require('react-native').View,
    { testID: 'emoji-picker-modal' },
    React.createElement(require('react-native').TouchableOpacity, {
      testID: 'emoji-option',
      onPress: () => onEmojiSelected({ emoji: '🎯' }),
    }),
    React.createElement(require('react-native').TouchableOpacity, {
      testID: 'close-picker',
      onPress: onClose,
    }),
  );
};

module.exports = {
  __esModule: true,
  default: MockEmojiPicker,
};
