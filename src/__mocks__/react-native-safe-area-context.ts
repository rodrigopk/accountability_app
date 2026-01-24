/**
 * Shared mock for react-native-safe-area-context
 * Used across multiple test files
 */

import { createElement, ReactNode } from 'react';
import { View } from 'react-native';

interface SafeAreaProviderProps {
  children: ReactNode;
}

module.exports = {
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  SafeAreaProvider: ({ children }: SafeAreaProviderProps) => {
    return createElement(View, null, children);
  },
};
