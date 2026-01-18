/**
 * @format
 */

import React from 'react';
import { act, create } from 'react-test-renderer';

import App from '../App';

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

test('renders correctly', async () => {
  await act(async () => {
    create(<App />);
    // Flush all pending timers to prevent async cleanup errors
    jest.runAllTimers();
  });
});
