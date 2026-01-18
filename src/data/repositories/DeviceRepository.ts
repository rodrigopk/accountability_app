import { getUniqueId } from 'react-native-device-info';

import { DeviceInfo } from '../../types/DeviceInfo';
import { StorageAdapter } from '../storage/StorageAdapter';

const DEVICE_INFO_KEY = 'device_info';

/**
 * Repository for device information data access.
 * Handles fetching unique device ID and persisting device info.
 *
 * Unlike other repositories, DeviceRepository stores a singleton entity
 * (one device info per app installation) rather than a collection.
 */
export class DeviceRepository {
  private storage: StorageAdapter;

  constructor(storage: StorageAdapter) {
    this.storage = storage;
  }

  /**
   * Get device info from storage, or create if it doesn't exist.
   * This is the primary method for accessing device information.
   * @returns DeviceInfo with unique device ID
   */
  async getOrCreateDeviceInfo(): Promise<DeviceInfo> {
    const existing = await this.getDeviceInfo();
    if (existing) {
      return existing;
    }

    // Create new device info on first launch
    const deviceId = await getUniqueId();
    const newDeviceInfo: DeviceInfo = {
      id: deviceId,
      createdAt: new Date().toISOString(),
    };

    await this.storage.set(DEVICE_INFO_KEY, newDeviceInfo);

    return newDeviceInfo;
  }

  /**
   * Get device info from storage without creating.
   * @returns DeviceInfo or null if not found
   */
  async getDeviceInfo(): Promise<DeviceInfo | null> {
    return this.storage.get<DeviceInfo>(DEVICE_INFO_KEY);
  }

  /**
   * Get the device ID, creating device info if necessary.
   * Convenience method for when only the ID is needed.
   * @returns Device ID string
   */
  async getDeviceId(): Promise<string> {
    const deviceInfo = await this.getOrCreateDeviceInfo();
    return deviceInfo.id;
  }

  /**
   * Clear device info from storage.
   * Primarily useful for testing or factory reset scenarios.
   */
  async clearDeviceInfo(): Promise<void> {
    await this.storage.delete(DEVICE_INFO_KEY);
  }
}
