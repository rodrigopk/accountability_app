// Suppress InteractionManager deprecation warning from react-navigation
const originalWarn = console.warn;
console.warn = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('InteractionManager has been deprecated')) {
    return;
  }
  originalWarn.apply(console, args);
};

// Mock react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => {
  const React = require('react');
  const { View } = require('react-native');

  const MockGestureHandler = ({ children }) => React.createElement(View, null, children);

  return {
    Swipeable: MockGestureHandler,
    DrawerLayout: MockGestureHandler,
    State: {},
    ScrollView: MockGestureHandler,
    Slider: MockGestureHandler,
    Switch: MockGestureHandler,
    TextInput: MockGestureHandler,
    ToolbarAndroid: MockGestureHandler,
    ViewPagerAndroid: MockGestureHandler,
    DrawerLayoutAndroid: MockGestureHandler,
    WebView: MockGestureHandler,
    NativeViewGestureHandler: MockGestureHandler,
    TapGestureHandler: MockGestureHandler,
    FlingGestureHandler: MockGestureHandler,
    ForceTouchGestureHandler: MockGestureHandler,
    LongPressGestureHandler: MockGestureHandler,
    PanGestureHandler: MockGestureHandler,
    PinchGestureHandler: MockGestureHandler,
    RotationGestureHandler: MockGestureHandler,
    RawButton: MockGestureHandler,
    BaseButton: MockGestureHandler,
    RectButton: MockGestureHandler,
    BorderlessButton: MockGestureHandler,
    FlatList: MockGestureHandler,
    gestureHandlerRootHOC: jest.fn(component => component),
    GestureHandlerRootView: MockGestureHandler,
    Directions: {},
  };
});

// Mock AsyncStorage
const mockStorage = {};

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(key => {
      return Promise.resolve(mockStorage[key] || null);
    }),
    setItem: jest.fn((key, value) => {
      mockStorage[key] = value;
      return Promise.resolve();
    }),
    removeItem: jest.fn(key => {
      delete mockStorage[key];
      return Promise.resolve();
    }),
    multiGet: jest.fn(keys => {
      const result = keys.map(key => [key, mockStorage[key] || null]);
      return Promise.resolve(result);
    }),
    multiSet: jest.fn(pairs => {
      pairs.forEach(([key, value]) => {
        mockStorage[key] = value;
      });
      return Promise.resolve();
    }),
    multiRemove: jest.fn(keys => {
      keys.forEach(key => {
        delete mockStorage[key];
      });
      return Promise.resolve();
    }),
    clear: jest.fn(() => {
      Object.keys(mockStorage).forEach(k => delete mockStorage[k]);
      return Promise.resolve();
    }),
  },
}));

// Mock react-native-device-info
jest.mock('react-native-device-info', () => ({
  getUniqueId: jest.fn(() => Promise.resolve('mock-device-id')),
}));

// Mock uuid
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mock-uuid-' + Math.random().toString(36).substring(7)),
}));

// Mock react-native-calendars
jest.mock('react-native-calendars', () => {
  const React = require('react');
  const { View, TouchableOpacity, Text } = require('react-native');

  const MockCalendar = props => {
    return React.createElement(
      View,
      { testID: props.testID || 'mock-calendar' },
      React.createElement(
        TouchableOpacity,
        {
          testID: 'calendar-day',
          onPress: () => {
            if (props.onDayPress) {
              const today = new Date();
              props.onDayPress({
                dateString: today.toISOString().split('T')[0],
                day: today.getDate(),
                month: today.getMonth() + 1,
                year: today.getFullYear(),
                timestamp: today.getTime(),
              });
            }
          },
        },
        React.createElement(Text, null, 'Mock Calendar Day'),
      ),
    );
  };

  return {
    __esModule: true,
    Calendar: MockCalendar,
  };
});

// Mock react-native-navigation
jest.mock('react-native-navigation', () => ({
  Navigation: {
    events: jest.fn(() => ({
      registerModalDismissedListener: jest.fn(() => ({
        remove: jest.fn(),
      })),
      registerComponentDidAppearListener: jest.fn(() => ({
        remove: jest.fn(),
      })),
      registerComponentDidDisappearListener: jest.fn(() => ({
        remove: jest.fn(),
      })),
    })),
    push: jest.fn(),
    pop: jest.fn(),
    showModal: jest.fn(),
    dismissModal: jest.fn(),
    dismissAllModals: jest.fn(),
    setRoot: jest.fn(),
    setStackRoot: jest.fn(),
  },
}));
