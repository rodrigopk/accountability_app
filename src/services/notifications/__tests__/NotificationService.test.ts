import { AccountabilityRound } from '../../../types/AccountabilityRound';
import { Goal } from '../../../types/Goal';
import { MockNotificationProvider } from '../__mocks__/NotificationProvider';
import { NotificationService } from '../NotificationService';

describe('NotificationService', () => {
  let service: NotificationService;
  let mockProvider: MockNotificationProvider;

  beforeEach(() => {
    mockProvider = new MockNotificationProvider();
    service = new NotificationService(mockProvider);
    mockProvider.reset();
    jest.useRealTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('initialize', () => {
    it('should initialize provider and create channel', async () => {
      mockProvider.permissionGranted = true;
      const granted = await service.initialize();

      expect(granted).toBe(true);
      expect(mockProvider.channels).toHaveLength(1);
      expect(mockProvider.channels[0].channelId).toBe('goal-reminders');
    });

    it('should return false if permission not granted', async () => {
      mockProvider.permissionGranted = false;
      const granted = await service.initialize();

      expect(granted).toBe(false);
    });
  });

  describe('scheduleForRound', () => {
    const createRound = (goals: Goal[]): AccountabilityRound => ({
      id: 'round-1',
      deviceId: 'device-1',
      startDate: '2024-01-01',
      endDate: '2024-01-07',
      goals,
      reward: 'Reward',
      punishment: 'Punishment',
      createdAt: '2024-01-01T00:00:00Z',
    });

    it('should schedule notifications for daily goals', async () => {
      const goal: Goal = {
        id: 'goal-1',
        title: 'Exercise',
        frequency: { type: 'daily' },
        durationSeconds: 3600,
        notificationTime: '09:00',
      };

      const round = createRound([goal]);

      // Mock current date to be before the round starts
      const mockDate = new Date('2023-12-31T00:00:00Z');
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);

      await service.scheduleForRound(round);

      // Should schedule 7 notifications (one per day)
      expect(mockProvider.scheduledNotifications.length).toBe(7);
      expect(mockProvider.scheduledNotifications[0].title).toContain('Exercise');

      jest.useRealTimers();
    });

    it('should schedule notifications for specificDays goals', async () => {
      const goal: Goal = {
        id: 'goal-1',
        title: 'Exercise',
        frequency: { type: 'specificDays', days: ['monday', 'wednesday', 'friday'] },
        durationSeconds: 3600,
        notificationTime: '09:00',
      };

      const round = createRound([goal]);

      const mockDate = new Date('2023-12-31T00:00:00Z');
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);

      await service.scheduleForRound(round);

      // Should schedule 3 notifications (Mon, Wed, Fri)
      expect(mockProvider.scheduledNotifications.length).toBe(3);

      jest.useRealTimers();
    });

    it('should schedule notifications for timesPerWeek goals', async () => {
      const goal: Goal = {
        id: 'goal-1',
        title: 'Exercise',
        frequency: { type: 'timesPerWeek', count: 3 },
        durationSeconds: 3600,
        notificationTime: '09:00',
      };

      const round = createRound([goal]);

      const mockDate = new Date('2023-12-31T00:00:00Z');
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);

      await service.scheduleForRound(round);

      // Should schedule 3 notifications (Mon, Wed, Fri)
      expect(mockProvider.scheduledNotifications.length).toBe(3);

      jest.useRealTimers();
    });

    it('should skip past notification times', async () => {
      const goal: Goal = {
        id: 'goal-1',
        title: 'Exercise',
        frequency: { type: 'daily' },
        durationSeconds: 3600,
        notificationTime: '09:00',
      };

      const round = createRound([goal]);

      // Mock current date to be in the middle of the round
      const mockDate = new Date('2024-01-05T10:00:00Z');
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);

      await service.scheduleForRound(round);

      // Should only schedule future notifications (Jan 6, 7)
      expect(mockProvider.scheduledNotifications.length).toBe(2);

      jest.useRealTimers();
    });
  });

  describe('cancelForRound', () => {
    it('should cancel all notifications for a round', async () => {
      const roundId = 'round-1';

      // Pre-populate some notifications
      mockProvider.scheduledNotifications = [
        {
          id: `${roundId}-goal-1-2024-01-01`,
          title: 'Test',
          message: 'Test',
          date: new Date(),
        },
        {
          id: `${roundId}-goal-2-2024-01-02`,
          title: 'Test',
          message: 'Test',
          date: new Date(),
        },
        {
          id: 'other-round-goal-1-2024-01-01',
          title: 'Test',
          message: 'Test',
          date: new Date(),
        },
      ];

      await service.cancelForRound(roundId);

      expect(mockProvider.cancelledTags).toContain(roundId);
      expect(mockProvider.scheduledNotifications.length).toBe(1);
      expect(mockProvider.scheduledNotifications[0].id).toBe('other-round-goal-1-2024-01-01');
    });
  });
});
