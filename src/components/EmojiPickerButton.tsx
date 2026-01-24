import React, { useState } from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import EmojiPicker, { EmojiType } from 'rn-emoji-keyboard';

import { colors, borderRadius } from '../theme';

interface EmojiPickerButtonProps {
  value?: string;
  onChange: (emoji: string) => void;
  size?: 'small' | 'medium' | 'large';
  placeholder?: string;
}

const sizeMap = {
  small: 32,
  medium: 48,
  large: 64,
};

export function EmojiPickerButton({
  value,
  onChange,
  size = 'medium',
  placeholder = '➕',
}: EmojiPickerButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dimension = sizeMap[size];

  const handleEmojiSelected = (emojiObject: EmojiType) => {
    onChange(emojiObject.emoji);
    setIsOpen(false);
  };

  return (
    <>
      <TouchableOpacity
        style={[
          styles.button,
          {
            width: dimension,
            height: dimension,
            borderRadius: borderRadius.md,
          },
          value ? styles.buttonFilled : styles.buttonEmpty,
        ]}
        onPress={() => setIsOpen(true)}
        testID="emoji-picker-button"
      >
        <Text style={{ fontSize: dimension * 0.5 }}>{value || placeholder}</Text>
      </TouchableOpacity>

      <EmojiPicker
        onEmojiSelected={handleEmojiSelected}
        open={isOpen}
        onClose={() => setIsOpen(false)}
        enableSearchBar
        categoryPosition="top"
      />
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  buttonEmpty: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  buttonFilled: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
    borderStyle: 'solid',
  },
});
