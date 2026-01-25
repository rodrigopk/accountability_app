// Mock for react-native-push-notification
const mockPushNotification = {
  configure: jest.fn(),
  createChannel: jest.fn((channel, callback) => {
    if (callback) callback();
  }),
  localNotificationSchedule: jest.fn(),
  cancelLocalNotification: jest.fn(),
  cancelAllLocalNotifications: jest.fn(),
  getScheduledLocalNotifications: jest.fn(callback => {
    if (callback) callback([]);
  }),
  checkPermissions: jest.fn(callback => {
    if (callback) callback({ alert: true, badge: true, sound: true });
  }),
};

export default mockPushNotification;
