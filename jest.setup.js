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
