import { getUniqueId } from 'react-native-device-info';

import { DeviceInfo as DeviceInfoType } from '../../types/DeviceInfo';
import { StorageAdapter } from '../storage/StorageAdapter';

const DEVICE_INFO_KEY = 'device_info';

/**
 * Repository for device information data access.
 * Handles fetching unique device ID and persisting device info.
 */
export class DeviceRepository {
  private storage: StorageAdapter;

  constructor(storage: StorageAdapter) {
    this.storage = storage;
  }

  /**
   * Get device info from storage, or create if it doesn't exist
   * @returns DeviceInfo with unique device ID
   */
  async getOrCreateDeviceInfo(): Promise<DeviceInfoType> {
    // Try to get existing device info
    const existing = await this.storage.get<DeviceInfoType>(DEVICE_INFO_KEY);
    if (existing) {
      return existing;
    }

    // Create new device info on first launch
    const deviceId = await getUniqueId();
    const newDeviceInfo: DeviceInfoType = {
      id: deviceId,
      createdAt: new Date().toISOString(),
    };

    // Save to storage
    await this.storage.set(DEVICE_INFO_KEY, newDeviceInfo);

    return newDeviceInfo;
  }

  /**
   * Get device info from storage
   * @returns DeviceInfo or null if not found
   */
  async getDeviceInfo(): Promise<DeviceInfoType | null> {
    return this.storage.get<DeviceInfoType>(DEVICE_INFO_KEY);
  }
}
